export interface MapNode {
  id: string;
  building: string;
  floor: string;
  roomNumber?: string;
  name: string;
  x: number;
  y: number;
  isAccessible: boolean;
}

export interface IndoorRoute {
  sourceNodeId: string;
  targetNodeId: string;
  pathNodes: string[];
  totalDistanceMeters: number;
  isAccessible: boolean;
  instructions: string[];
}
