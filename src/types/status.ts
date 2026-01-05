export type ComponentStatus =
| "operational"
| "under_maintenance"
| "degraded_performance"
| "major_outage"
| "partial_outage";

export type Service = {
    id: string;
    name: string;
    region: string;
    status: ComponentStatus;
    latency: number;
    uptime: string;
}

export type Incident = {
    id: string;
    name: string;
    status: string;
    updated_at: string;
}