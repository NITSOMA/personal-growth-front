export interface TimeTrackerInerface {
  id: number;
  name: string;
  time_today: number;
}


export interface TaskStatsInterface {
  id: number;
  name: string;
  total_time: number;
}

export interface TimeRequest {
  name?: string;
  dedicated_time?: number;
}