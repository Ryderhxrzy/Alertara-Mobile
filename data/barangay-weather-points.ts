export interface BarangayWeatherPoint {
  id: string;
  barangay: string;
  latitude: number;
  longitude: number;
}

// Approximate marker anchors for local barangay weather forecasts in QC.
export const barangayWeatherPoints: BarangayWeatherPoint[] = [
  { id: "masambong", barangay: "Masambong", latitude: 14.6399, longitude: 121.0226 },
  { id: "del-monte", barangay: "Del Monte", latitude: 14.6342, longitude: 121.0201 },
  { id: "talayan", barangay: "Talayan", latitude: 14.6438, longitude: 121.0299 },
  { id: "bagong-silangan", barangay: "Bagong Silangan", latitude: 14.7021, longitude: 121.1167 },
  { id: "batasan-hills", barangay: "Batasan Hills", latitude: 14.6768, longitude: 121.1019 },
  { id: "libis", barangay: "Libis", latitude: 14.6207, longitude: 121.0749 },
  { id: "bagumbayan", barangay: "Bagumbayan", latitude: 14.6099, longitude: 121.0808 },
  { id: "dona-imelda", barangay: "Dona Imelda", latitude: 14.6218, longitude: 121.0299 },
  { id: "north-fairview", barangay: "North Fairview", latitude: 14.6988, longitude: 121.0627 },
  { id: "novaliches-proper", barangay: "Novaliches Proper", latitude: 14.7184, longitude: 121.0378 },
  { id: "san-bartolome", barangay: "San Bartolome", latitude: 14.7249, longitude: 121.0422 },
  { id: "sta-monica", barangay: "Sta. Monica", latitude: 14.7336, longitude: 121.0355 },
];

