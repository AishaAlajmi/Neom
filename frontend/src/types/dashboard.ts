export interface Site {
  id: string;
  name: string;
  status: "active" | "warning" | "critical";
  cameras: Camera[];
  activeWorkers: number;
  violations: number;
}

export interface Camera {
  id: string;
  name: string;
  status: "online" | "offline";
  feed: string;
}

export interface Alert {
  id: string;
  timestamp: Date;
  site: string;
  type: "PPE Violation" | "Fall Incident" | "Unauthorized Access" | "Equipment Alert";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  resolved: boolean;
}

export interface IncidentData {
  month: string;
  incidents: number;
  violations: number;
}

export interface SafetyMetric {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down";
}
