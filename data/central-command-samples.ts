export type SampleRecord = {
  id: string;
  title: string;
  summary: string;
  status: "Live" | "Draft" | "Monitoring" | "Scheduled";
  reference: string;
};

export const systemSamples: Record<
  string,
  SampleRecord[]
> = {
  law: [
    {
      id: "law-incident-042",
      title: "Downtown Incident Logging",
      summary: "Case assigned to Field Team A with amber alert for vehicle evidence.",
      status: "Live",
      reference: "Incident #042",
    },
    {
      id: "law-analysis-004",
      title: "Evidence Chain Review",
      summary: "Digital blotter updated with chain-of-custody for exhibit 7B.",
      status: "Monitoring",
      reference: "Blotter Delta",
    },
  ],
  traffic: [
    {
      id: "traffic-cctv-09",
      title: "CCTV Flow Monitoring",
      summary: "Camera 23 flagged congestion near the river bridge; rerouting plan ready.",
      status: "Live",
      reference: "Flow Alert 09",
    },
    {
      id: "traffic-violation-02",
      title: "Violation Ticketing",
      summary: "Automated permit check triggered fine for downtown delivery truck.",
      status: "Draft",
      reference: "Ticket 02-2026",
    },
  ],
  fire: [
    {
      id: "fire-dispatch-11",
      title: "Fire Station Dispatch",
      summary: "Unit 5 en route to Wharf District after hydrant activation report.",
      status: "Live",
      reference: "Dispatch 11",
    },
    {
      id: "fire-training-02",
      title: "Training Roster",
      summary: "Certification scheduled for hazardous materials team next Tuesday.",
      status: "Scheduled",
      reference: "Training Batch 02",
    },
  ],
  response: [
    {
      id: "response-gps-01",
      title: "Responder GPS Tracking",
      summary: "EMS 14 and Police 8 currently converged on priority incident.",
      status: "Live",
      reference: "Response Ops",
    },
    {
      id: "response-911-07",
      title: "Call Prioritization",
      summary: "911 log shows three high-priority entries pending dispatch.",
      status: "Monitoring",
      reference: "Call Batch 07",
    },
  ],
  surveillance: [
    {
      id: "surv-watch-24",
      title: "Neighborhood Watch Coordination",
      summary: "Volunteer patrol confirmed two suspicious vehicles near Market Street.",
      status: "Live",
      reference: "Watch 24",
    },
    {
      id: "surv-complaint-11",
      title: "Complaint Resolution",
      summary: "Noise violation routed to community liaison for follow-through.",
      status: "Draft",
      reference: "Complaint 11",
    },
  ],
  analytics: [
    {
      id: "analytics-heat-05",
      title: "Heatmap Trend",
      summary: "North precinct shows spike in thefts between 6pm-9pm.",
      status: "Monitoring",
      reference: "Heatmap 05",
    },
    {
      id: "analytics-report-02",
      title: "Clearance Rate Dashboard",
      summary: "Clearance at 78% this quarter, 4 points higher than projection.",
      status: "Live",
      reference: "Dashboard Q1",
    },
  ],
  campaign: [
    {
      id: "campaign-001",
      title: "Public Safety Campaign",
      summary: "Posters, social clips, and door-to-door messaging scheduled for April.",
      status: "Scheduled",
      reference: "Campaign Spring",
    },
    {
      id: "campaign-feedback",
      title: "Feedback Loop",
      summary: "Survey on neighborhood watch effectiveness open for two weeks.",
      status: "Live",
      reference: "Feedback Campaign",
    },
  ],
  inspection: [
    {
      id: "inspection-restaurant-08",
      title: "Business Compliance Audit",
      summary: "Health inspector found two minor violations; citations drafted.",
      status: "Draft",
      reference: "Audit 08",
    },
    {
      id: "inspection-field-05",
      title: "Site Visit Scheduling",
      summary: "Checklist ready for upcoming mall inspection team.",
      status: "Scheduled",
      reference: "Site Visit 05",
    },
  ],
  readiness: [
    {
      id: "readiness-sim-01",
      title: "Simulation Readiness",
      summary: "Training modules loaded for typhoon scenario next week.",
      status: "Scheduled",
      reference: "Simulation 01",
    },
    {
      id: "readiness-pos",
      title: "Participant Registry",
      summary: "Volunteer roster updated with availability for March drills.",
      status: "Live",
      reference: "Readiness Roster",
    },
  ],
  broadcast: [
    {
      id: "broadcast-mass-07",
      title: "Mass Notification",
      summary: "SMS, email, and PA prepped for flash flood advisory.",
      status: "Live",
      reference: "Alert 07",
    },
    {
      id: "broadcast-category-02",
      title: "Alert Categorization",
      summary: "Weather and earthquake feeds aggregated for automation rule.",
      status: "Monitoring",
      reference: "Alert Mode 02",
    },
  ],
  inventory: [
    {
      id: "inventory-equipment-04",
      title: "Equipment Inventory",
      summary: "Generator stocks replenished; next maintenance due in two weeks.",
      status: "Live",
      reference: "Inventory Sheet 4",
    },
    {
      id: "inventory-sim-03",
      title: "Simulation Assets",
      summary: "Training radios and drones staged for disaster simulation.",
      status: "Scheduled",
      reference: "Sim Assets 03",
    },
  ],
};

export const getSampleRecords = (systemId: string) =>
  systemSamples[systemId] ?? [];
