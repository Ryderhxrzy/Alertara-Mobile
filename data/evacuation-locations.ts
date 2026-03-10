export interface EvacuationLocation {
  id: string;
  name: string;
  district: "District 1" | "District 2" | "District 4" | "District 5" | "District 6";
  latitude: number;
  longitude: number;
}

const DISTRICT_BASE_COORDS: Record<EvacuationLocation["district"], { lat: number; lng: number }> = {
  "District 1": { lat: 14.6578, lng: 121.0325 },
  "District 2": { lat: 14.7085, lng: 121.1082 },
  "District 4": { lat: 14.6282, lng: 121.0543 },
  "District 5": { lat: 14.7243, lng: 121.0436 },
  "District 6": { lat: 14.6768, lng: 121.0314 },
};

const DISTRICT_STEP = 0.0022;

function withDistrictOffset(
  district: EvacuationLocation["district"],
  indexInDistrict: number
) {
  const base = DISTRICT_BASE_COORDS[district];
  const col = indexInDistrict % 4;
  const row = Math.floor(indexInDistrict / 4);
  const latOffset = (row - 1) * DISTRICT_STEP;
  const lngOffset = (col - 1.5) * DISTRICT_STEP;
  return {
    latitude: +(base.lat + latOffset).toFixed(6),
    longitude: +(base.lng + lngOffset).toFixed(6),
  };
}

const namesByDistrict: Record<EvacuationLocation["district"], string[]> = {
  "District 1": [
    "Brgy Alicia Hall - 3rd Floor",
    "Bago Bantay Elementary School",
    "Bagong Pag-asa Elementary School",
    "Bagong Pag-asa Multipurpose Covered Court",
    "Bahay Toro Basketball Court",
    "Toro Hills Elementary School",
    "Barangay Bungad Covered Court",
    "Bungad Elementary School",
    "Damar Multi-Purpose Hall",
    "Cong. Calalay Elementary School (Brgy Damayan)",
    "Minor Basilica of Saint Pedro Bautista",
    "Dalupan Elementary School (Brgy Del Monte)",
    "San Francisco Elementary School",
  ],
  "District 2": [
    "Bagong Silangan Elementary School",
    "Bagong Silangan High School",
    "Bona Multipurpose Hall",
    "Brookside Evacuation Site",
    "Clemencia Evacuation Center",
    "Humanityville Evacuation Center",
    "Fil-Heights Clubhouse",
    "Kawan Chapel (Sitio Veterans)",
    "San Isidro Church",
    "Lumang Palengke",
    "Vicente Ville Housing",
    "Batasan Hills Area A-3 Covered Court",
  ],
  "District 4": [
    "Quezon Memorial Circle open space",
    "Daza Hall",
    "Orchids Covered Court",
    "Trinity University of Asia Building",
    "Missionary Society of Saint Paul",
    "San Lorenzo facility",
    "Jacinto Covered Court (Brgy Dona Aurora)",
    "Dona Imelda Multipurpose Hall Gymnasium",
    "Malangen Hall",
    "Justice Hall",
    "Barangay Kamuning Function Hall",
  ],
  "District 5": [
    "San Pedro Covered Court (Bagbag)",
    "St. Nicholas of Bari School",
    "Capri Activity Center",
    "Fairlane Elementary School",
    "Ascension of Our Lord Parish Church Patio",
    "Fatima University Covered Court",
    "Zabarte Covered Court (Kaligayahan)",
    "Vargas Building (Novaliches Proper)",
    "Dona Isaura Covered Court",
    "Odelco Elementary School (San Bartolome)",
    "Villaverde Covered Court (Sta. Monica)",
  ],
  "District 6": [
    "Apolonio Samson Elementary School",
    "Baesa Elementary School",
    "St. Martin De Porres Chapel",
    "Balong-Bato Health Center",
    "Culiat High School",
    "Dunong Kabuhayan Training Center",
    "Tandang Sora Barangay Hall",
    "Sauyo Elementary School",
    "Mathay High School (Sangandaan)",
    "Placido del Mundo Elementary School",
    "UP Campus Dagohoy Hall",
    "UP Village Basketball Court",
  ],
};

export const evacuationLocations: EvacuationLocation[] = (
  Object.entries(namesByDistrict) as Array<
    [EvacuationLocation["district"], string[]]
  >
).flatMap(([district, names]) =>
  names.map((name, index) => {
    const coords = withDistrictOffset(district, index);
    return {
      id: `${district.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
      name,
      district,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  })
);

export const floodProneBarangays = [
  "Masambong",
  "Del Monte",
  "Talayan",
  "Bagong Silangan",
  "Batasan Hills",
  "Libis",
  "Bagumbayan",
  "Dona Imelda",
  "North Fairview",
  "Novaliches Proper",
  "San Bartolome",
  "Sta. Monica",
];
