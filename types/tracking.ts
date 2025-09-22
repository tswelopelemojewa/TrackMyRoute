
export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface TrackingSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  distance: number;
  path: LocationPoint[];
  isActive: boolean;
}

export interface SessionStats {
  totalDistance: number;
  duration: number;
  startTime: number;
  endTime: number;
  averageSpeed: number;
}
