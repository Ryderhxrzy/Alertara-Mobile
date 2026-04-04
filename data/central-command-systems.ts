export type SystemDefinition = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof ICON_MAP;
  accent: string;
  modules: string[];
};

// map a handful of icon names to keep typing consistent with IconSymbol usage
const ICON_MAP = {
  shield: "shield",
  network: "network",
  fire: "flame",
  response: "bolt",
  surveillance: "viewfinder",
  analytics: "chart.bar",
  campaign: "megaphone",
  inspection: "clipboard.checkmark",
  readiness: "wand.and.stars",
  broadcast: "antenna.radiowaves.left.and.right",
  inventory: "archivebox",
};

export const systemRegistry: Record<string, SystemDefinition> = {
  law: {
    id: "law",
    title: "Law Enforcement & Incident Reporting",
    description:
      "Incident logging, evidence tracking, assignments, analytics, and national database links.",
    icon: "shield",
    accent: "#1abc9c",
    modules: [
      "Incident Logging & Classification",
      "Digital Blotter & Case Tracking",
      "Evidence Chain-of-Custody",
      "Analytics & National Integrations",
    ],
  },
  traffic: {
    id: "traffic",
    title: "Traffic & Transport Management",
    description: "Monitor flow, violations, routing, public transport, and permits.",
    icon: "network",
    accent: "#3498db",
    modules: [
      "Traffic Flow Monitoring (CCTV)",
      "Accident & Violation Reporting",
      "Routing & Signal Control",
      "Public Transport Coordination",
    ],
  },
  fire: {
    id: "fire",
    title: "Fire & Rescue Services",
    description: "Dispatch, inventory, training, and post-incident reviews.",
    icon: "fire",
    accent: "#e67e22",
    modules: [
      "Incident Response Dispatch",
      "Equipment/Station Inventory",
      "Personnel Shift Scheduling",
      "Training & Inspection Records",
    ],
  },
  response: {
    id: "response",
    title: "Emergency Response System",
    description: "Call logging, dispatch prioritization, responder tracking, and analytics.",
    icon: "response",
    accent: "#f1c40f",
    modules: [
      "Emergency Call Logging (911)",
      "Incident Prioritization & Dispatch",
      "Resource Allocation (EMS, Fire, Police)",
      "Responder GPS Tracking & Analytics",
    ],
  },
  surveillance: {
    id: "surveillance",
    title: "Community Policing & Surveillance",
    description: "Neighborhood watch, CCTV management, complaints, and outreach.",
    icon: "surveillance",
    accent: "#9b59b6",
    modules: [
      "Neighborhood Watch Coordination",
      "CCTV Surveillance System Management",
      "Complaint Logging & Resolution",
      "Awareness & Outreach Tracking",
    ],
  },
  analytics: {
    id: "analytics",
    title: "Crime Data Analytics & Reporting",
    description: "Dashboards, heatmaps, predictive policing, and automated alerts.",
    icon: "analytics",
    accent: "#2ecc71",
    modules: [
      "Heatmaps & Trend Analysis",
      "Predictive Policing Tools",
      "Custom Report Builder",
      "Integration with National/Local Databases",
    ],
  },
  campaign: {
    id: "campaign",
    title: "Public Safety Campaign Management",
    description: "Plan campaigns, manage content, register events, and capture feedback.",
    icon: "campaign",
    accent: "#d35400",
    modules: [
      "Campaign Planning & Scheduling",
      "Content Repository (posters/videos)",
      "Target Audience Segmentation",
      "Feedback & Survey Tools",
    ],
  },
  inspection: {
    id: "inspection",
    title: "Health & Safety Inspections",
    description: "Schedule inspections, follow checklists, upload evidence, and issue citations.",
    icon: "inspection",
    accent: "#16a085",
    modules: [
      "Inspection Scheduling & Assignment",
      "Checklist-Based Field Forms",
      "Photo/Video Uploads & Violation Ticketing",
      "Inspector Certification Tracking",
    ],
  },
  readiness: {
    id: "readiness",
    title: "Disaster Preparedness & Simulation",
    description: "Training modules, simulations, participant tracking, and certification.",
    icon: "readiness",
    accent: "#2980b9",
    modules: [
      "Training Module Management",
      "Simulation Event Planning",
      "Participant Registration & Scoring",
      "Scenario-Based Exercise Design",
    ],
  },
  broadcast: {
    id: "broadcast",
    title: "Emergency Communication System",
    description: "Mass notification, automated warnings, multilingual support, and audit logs.",
    icon: "broadcast",
    accent: "#c0392b",
    modules: [
      "Mass Notification",
      "Alert Catalog",
      "Two-Way Feedback",
      "Language Support",
      "Subscriptions & Preferences",
      "Audit Log",
    ],
  },
  inventory: {
    id: "inventory",
    title: "Resource & Equipment Inventory",
    description: "Track equipment, stock for simulations, and maintenance.",
    icon: "inventory",
    accent: "#7f8c8d",
    modules: [
      "Equipment Inventory Tracking",
      "Simulation Resources",
      "Maintenance Schedules",
      "Assignment History",
    ],
  },
};

export type SystemCluster = {
  id: string;
  label: string;
  description: string;
  systems: (keyof typeof systemRegistry)[];
};

export const systemClusters: SystemCluster[] = [
  {
    id: "incident-ops",
    label: "Incident Ops",
    description: "Capture and resolve law enforcement, response, and traffic incidents.",
    systems: ["law", "traffic", "fire", "response"],
  },
  {
    id: "safety-monitoring",
    label: "Safety Monitoring",
    description: "Surveillance, analytics, and oversight to keep neighborhoods secure.",
    systems: ["surveillance", "analytics", "inspection"],
  },
  {
    id: "community-support",
    label: "Community Support",
    description: "Campaigns, readiness programs, communications, and inventory.",
    systems: ["campaign", "readiness", "broadcast", "inventory"],
  },
];

export const getSystemDefinition = (id: string) =>
  systemRegistry[id as keyof typeof systemRegistry];
