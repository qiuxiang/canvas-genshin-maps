export interface MapData {
  id: number;
  slices: Array<string[]>;
  mapAnchors: MapAnchor[];
  mapPointLabels: MapPointLabel[];
  icon: string;
  name: string;
  origin: number[];
  size: number[];
}

export interface MapAnchor {
  name: string;
  x: number;
  y: number;
  children: MapAnchor[];
}

export interface MapPointLabel {
  id: number;
  name: string;
  icon: string;
  children: MapPointLabel[];
  mapPoints: MapPoint[];
}

export interface MapPoint {
  id: number;
  x: number;
  y: number;
}
