import { TealColors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { CrimeDataPoint, UserLocation } from "@/types/crime";
import React, { useMemo } from "react";
import { WebView } from "react-native-webview";

interface LeafletMapProps {
  coordinates: { latitude: number; longitude: number }[];
  borderColor?: string;
  zoomPadding?: number;
  minZoom?: number;
  crimeData?: CrimeDataPoint[];
  isLoadingCrimeData?: boolean;
  userLocation?: UserLocation | null;
}

export function LeafletMap({
  coordinates,
  borderColor,
  zoomPadding = 20,
  minZoom = 11.6,
  crimeData = [],
  isLoadingCrimeData = false,
  userLocation,
}: LeafletMapProps) {
  const { isDarkMode } = useTheme();

  // Calculate bounds from coordinates
  const bounds = useMemo(() => {
    if (!coordinates || coordinates.length === 0) return null;

    let minLat = coordinates[0].latitude;
    let maxLat = coordinates[0].latitude;
    let minLng = coordinates[0].longitude;
    let maxLng = coordinates[0].longitude;

    for (const coord of coordinates) {
      minLat = Math.min(minLat, coord.latitude);
      maxLat = Math.max(maxLat, coord.latitude);
      minLng = Math.min(minLng, coord.longitude);
      maxLng = Math.max(maxLng, coord.longitude);
    }

    return { minLat, maxLat, minLng, maxLng };
  }, [coordinates]);

  // Generate GeoJSON from coordinates
  const geojson = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates.map((c) => [c.longitude, c.latitude])],
          },
          properties: {},
        },
      ],
    };
  }, [coordinates]);

  const color =
    borderColor || (isDarkMode ? TealColors.primaryLight : TealColors.primary);
  const tileLayer = isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution = isDarkMode
    ? "© CartoDB contributors | © OpenStreetMap contributors"
    : "© OpenStreetMap contributors";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; width: 100%; overflow: hidden; }
        body { font-family: Arial, sans-serif; display: flex; flex-direction: column; }
        #map { height: 85%; width: 100%; }
        .legend-container {
          height: 15%;
          width: 100%;
          background: white;
          padding: 12px;
          border-top: 2px solid #ddd;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
          overflow-y: auto;
        }
        .legend-title {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 8px;
          color: #333;
        }
        .legend-scale {
          width: 100%;
          height: 24px;
          background: linear-gradient(to right, #0000ff, #00ff00, #ffff00, #ff8800, #ff0000, #8b0000);
          border-radius: 4px;
          margin-bottom: 8px;
          border: 1px solid #ccc;
        }
        .legend-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 6px;
          color: #666;
        }
        .legend-guide {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 15%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          font-size: 16px;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="loading" class="loading-overlay" style="display: none;">
        Loading crime data...
      </div>
      <div class="legend-container">
        <div class="legend-title">Crime Density Scale</div>
        <div class="legend-scale"></div>
        <div class="legend-labels">
          <span>Low Density</span>
          <span>Medium</span>
          <span>High Density</span>
        </div>
        <div class="legend-guide">
          <strong>Color Guide:</strong> Blue = Low | Green = Low-Medium | Orange = Medium | Red = High | Dark Red = Very High incident density
        </div>
      </div>
      <script>
        // Define heat layer function for heatmap visualization
        if (typeof L !== 'undefined' && !L.HeatLayer) {
          L.HeatLayer = L.Layer.extend({
            initialize: function(latlngs, options) {
              this._latlngs = latlngs;
              L.setOptions(this, options);
            },
            
            onAdd: function(map) {
              this._map = map;
              this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');
              var size = map.getSize();
              this._canvas.width = size.x;
              this._canvas.height = size.y;
              
              var animated = this._map.options.zoomAnimation && L.Browser.any3d;
              L.DomUtil.addClass(this._canvas, 'leaflet-layer');
              if (animated) L.DomUtil.addClass(this._canvas, 'leaflet-zoom-animated');
              else L.DomUtil.addClass(this._canvas, 'leaflet-zoom-hide');
              
              map.getPanes().overlayPane.appendChild(this._canvas);
              this._draw();
              
              map.on('moveend', this._reset, this);
              if (animated) {
                map.on('zoomanim', this._animateZoom, this);
              }
            },
            
            onRemove: function(map) {
              map.getPanes().overlayPane.removeChild(this._canvas);
              map.off('moveend', this._reset, this);
              if (this._map.options.zoomAnimation) {
                map.off('zoomanim', this._animateZoom, this);
              }
            },
            
            _getColorForIntensity: function(intensity) {
              var gradient = this.options.gradient;
              if (!gradient) {
                return { r: 0, g: 0, b: 255 };
              }

              // Find the color stops
              var stops = Object.keys(gradient).map(Number).sort(function(a, b) { return a - b; });

              var color1, color2, ratio;
              for (var i = 0; i < stops.length - 1; i++) {
                if (intensity >= stops[i] && intensity <= stops[i + 1]) {
                  color1 = this._hexToRgb(gradient[stops[i]]);
                  color2 = this._hexToRgb(gradient[stops[i + 1]]);
                  ratio = (intensity - stops[i]) / (stops[i + 1] - stops[i]);

                  return {
                    r: Math.round(color1.r + (color2.r - color1.r) * ratio),
                    g: Math.round(color1.g + (color2.g - color1.g) * ratio),
                    b: Math.round(color1.b + (color2.b - color1.b) * ratio)
                  };
                }
              }

              return this._hexToRgb(gradient[stops[stops.length - 1]]);
            },

            _draw: function() {
              if (!this._map) return;

              var ctx = this._canvas.getContext('2d');
              ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
              ctx.globalCompositeOperation = 'lighter';

              var size = this._map.getSize();
              var bounds = this._map.getBounds();
              var maxIntensity = this.options.max || 1.0;
              var radius = this.options.radius || 40;

              for (var i = 0; i < this._latlngs.length; i++) {
                var point = this._latlngs[i];
                var latlng = L.latLng(point[0], point[1]);
                var rawIntensity = point[2] || 0.5;
                var normalizedIntensity = Math.min(rawIntensity / maxIntensity, 1.0);

                if (bounds.contains(latlng)) {
                  var pixel = this._map.latLngToContainerPoint(latlng);
                  var color = this._getColorForIntensity(normalizedIntensity);

                  // Create radial gradient
                  var gradient = ctx.createRadialGradient(
                    pixel.x, pixel.y, 0,
                    pixel.x, pixel.y, radius
                  );

                  var alpha = 0.35 * normalizedIntensity;
                  gradient.addColorStop(0, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')');
                  gradient.addColorStop(0.5, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (alpha * 0.35) + ')');
                  gradient.addColorStop(1, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0)');

                  ctx.beginPath();
                  ctx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2);
                  ctx.fillStyle = gradient;
                  ctx.fill();
                }
              }

              ctx.globalCompositeOperation = 'source-over';
            },
            
            _hexToRgb: function(hex) {
              var r = parseInt(hex.slice(1, 3), 16);
              var g = parseInt(hex.slice(3, 5), 16);
              var b = parseInt(hex.slice(5, 7), 16);
              return { r: r, g: g, b: b };
            },

            _hexToRgba: function(hex, alpha) {
              var color = this._hexToRgb(hex);
              return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + alpha + ')';
            },
            
            _reset: function() {
              var topLeft = this._map.containerPointToLayerPoint([0, 0]);
              L.DomUtil.setPosition(this._canvas, topLeft);
              
              var size = this._map.getSize();
              this._canvas.width = size.x;
              this._canvas.height = size.y;
              this._draw();
            },
            
            _animateZoom: function(e) {
              var scale = this._map.getZoomScale(e.zoom);
              var offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
              
              L.DomUtil.setTransform(this._canvas, offset, scale);
            }
          });
          
          L.heatLayer = function(latlngs, options) {
            return new L.HeatLayer(latlngs, options);
          };
        }
        
        setTimeout(function() {
          try {
            // Wait for Leaflet to load
            if (typeof L === 'undefined') {
              console.error('Leaflet not loaded');
              return;
            }

            // GeoJSON data from the app
            const geojsonData = ${JSON.stringify(geojson)};

            // Create map
            const map = L.map('map', {
              zoomControl: true,
              dragging: true,
              scrollWheelZoom: true,
              boxZoom: true,
              keyboard: true,
              doubleClickZoom: true,
              touchZoom: true,
              zoomSnap: 0.1,
              maxBoundsViscosity: 0.5
            });

            L.tileLayer('${tileLayer}', {
              attribution: '${attribution}',
              maxZoom: 50,
              minZoom: ${minZoom}
            }).addTo(map);

            let heatmapLayer = null;
            let geoJsonLayer = null;

            // Function to add crime heatmap
            function addCrimeHeatmap(crimeData) {
              if (heatmapLayer) {
                map.removeLayer(heatmapLayer);
              }

              // Calculate density by counting incidents at each location
              const locationDensityMap = {};
              crimeData.forEach((point) => {
                const lat = point.lat || point.latitude || point.y;
                const lng = point.lng || point.longitude || point.x;

                if (lat && lng) {
                  // Round to 4 decimal places to group nearby incidents
                  const key = lat.toFixed(4) + ',' + lng.toFixed(4);
                  if (!locationDensityMap[key]) {
                    locationDensityMap[key] = { lat: lat, lng: lng, count: 0 };
                  }
                  locationDensityMap[key].count++;
                }
              });

              // Convert density map to heatmap data
              const heatmapData = Object.values(locationDensityMap).map((location) => {
                // Use count as intensity (higher count = higher intensity)
                const intensity = Math.min(location.count, 10) / 10; // Normalize to 0-1
                return [location.lat, location.lng, intensity];
              });

              console.log('Processing crime data:', crimeData.length, 'total incidents,', heatmapData.length, 'unique locations');

              if (heatmapData.length > 0) {
                // Find max intensity for reference
                const maxIntensity = Math.max(...heatmapData.map(p => p[2])) || 1.0;
                const maxCount = Math.max(...Object.values(locationDensityMap).map(l => l.count));

                heatmapLayer = L.heatLayer(heatmapData, {
                  radius: 45,
                  blur: 20,
                  maxZoom: 18,
                  minOpacity: 0.15,
                  max: maxIntensity,
                  gradient: {
                    0.0: '#0000ff',    // Blue - Low (1-2 incidents)
                    0.2: '#00ff00',    // Green - Low-Medium (2-3 incidents)
                    0.4: '#ffff00',    // Yellow - Medium (4-5 incidents)
                    0.6: '#ff8800',    // Orange - Medium-High (6-7 incidents)
                    0.8: '#ff0000',    // Red - High (8-9 incidents)
                    1.0: '#8b0000'     // Dark Red - Very High (10+ incidents)
                  }
                }).addTo(map);

                // Update legend with actual max count
                document.querySelector('.legend-labels').innerHTML =
                  '<span>Low (1-2)</span><span>Medium (5)</span><span>High (10+, max: ' + maxCount + ')</span>';
              } else {
                console.warn('No valid crime data points found');
              }
            }

            // Function to render crime data
            function renderCrimeData() {
              const loadingEl = document.getElementById('loading');

              // Use crime data passed from React Native
              const crimeDataFromApp = ${JSON.stringify(crimeData || [])};

              if (crimeDataFromApp && crimeDataFromApp.length > 0) {
                console.log('Using crime data from React Native:', crimeDataFromApp.length, 'points');
                addCrimeHeatmap(crimeDataFromApp);
              } else {
                // Use sample fallback data if no data provided
                console.log('No crime data provided, using sample data');
                const sampleData = [
                  // High density areas (multiple incidents)
                  { lat: 14.6762, lng: 121.0871, date: '2025-01-15' },
                  { lat: 14.6762, lng: 121.0871, date: '2025-02-01' },
                  { lat: 14.6762, lng: 121.0871, date: '2025-03-10' },
                  { lat: 14.682, lng: 121.096, date: '2025-01-22' },
                  { lat: 14.682, lng: 121.096, date: '2025-02-14' },
                  { lat: 14.7095, lng: 121.0985, date: '2025-02-08' },
                  { lat: 14.7095, lng: 121.0985, date: '2025-03-15' },
                  { lat: 14.7095, lng: 121.0985, date: '2025-04-22' },
                  // Medium density areas
                  { lat: 14.6948, lng: 121.106, date: '2025-04-08' },
                  { lat: 14.6948, lng: 121.106, date: '2025-05-20' },
                  { lat: 14.6679, lng: 121.0634, date: '2025-02-12' },
                  { lat: 14.6679, lng: 121.0634, date: '2025-03-25' },
                  // Lower density areas
                  { lat: 14.6523, lng: 121.0478, date: '2025-01-10' },
                  { lat: 14.7031, lng: 121.1028, date: '2025-02-05' },
                  { lat: 14.6578, lng: 121.0523, date: '2025-03-18' },
                  { lat: 14.6892, lng: 121.0853, date: '2025-02-22' }
                ];
                addCrimeHeatmap(sampleData);
              }

              if (loadingEl) {
                loadingEl.style.display = 'none';
              }
            }

            // Add user location marker if available
            const userLat = ${userLocation?.latitude || "null"};
            const userLng = ${userLocation?.longitude || "null"};
            const hasUserLocation = userLat !== null && userLng !== null;

            if (hasUserLocation) {
              const userIcon = L.divIcon({
                html: '<div style="background: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.3);"></div>',
                className: 'user-marker',
                iconSize: [22, 22],
                iconAnchor: [11, 11]
              });

              const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
              const locationText = 'You are here<br/>' + userLat.toFixed(4) + '°, ' + userLng.toFixed(4) + '°';
              userMarker.bindPopup(locationText).bindTooltip('You are here', { permanent: true, direction: 'top', offset: [0, -15], className: 'location-tooltip' });
            }

            // Add boundary
            if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
              geoJsonLayer = L.geoJSON(geojsonData, {
                style: function(feature) {
                  return {
                    color: '${color}',
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.02,
                    fillColor: '${color}'
                  };
                }
              }).addTo(map);

              // Get the bounds of the polygon
              const bounds = geoJsonLayer.getBounds();

              if (bounds.isValid()) {
                const paddedBounds = bounds.pad(0.1);

                // Always fit the map to QC boundary
                // User location marker will be displayed but doesn't auto-center the map
                map.fitBounds(paddedBounds, {
                  padding: [${zoomPadding}, ${zoomPadding}],
                  animate: false,
                  maxZoom: 50
                });

                // Set bounds to prevent moving too far
                const maxBounds = paddedBounds.pad(0.3);
                map.setMaxBounds(maxBounds);

                // Set minimum zoom
                const initialZoom = map.getZoom();
                map.setMinZoom(Math.min(${minZoom}, initialZoom));

                // Event listeners
                map.on('zoomend', function() {
                  if (map.getZoom() < ${minZoom}) {
                    map.setZoom(${minZoom});
                  }
                });

                map.on('moveend', function() {
                  const currentBounds = map.getBounds();
                  if (!maxBounds.intersects(currentBounds)) {
                    map.fitBounds(paddedBounds, {
                      padding: [${zoomPadding}, ${zoomPadding}],
                      animate: true
                    });
                  }
                });
              }
            } else {
              // Fallback if no coordinates
              map.setView([14.6721, 121.0437], ${minZoom});
              map.setMaxBounds([
                [14.5, 120.9],
                [14.8, 121.2]
              ]);
            }

            // Render crime data after map is initialized
            setTimeout(() => {
              renderCrimeData();
              map.invalidateSize();
            }, 300);

          } catch (e) {
            console.error('Map initialization error:', e);
            document.getElementById('loading').style.display = 'none';
          }
        }, 500);
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      source={{ html }}
      style={{ width: "100%", height: "100%" }}
      scrollEnabled={false}
      scalesPageToFit={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      originWhitelist={["*"]}
      mixedContentMode="always"
      overScrollMode="never"
      allowsInlineMediaPlayback={true}
      androidHardwareAccelerationDisabled={false}
      onLoadEnd={() => console.log("Crime density map loaded")}
      onError={(error) =>
        console.log("WebView error:", error.nativeEvent.description)
      }
    />
  );
}
