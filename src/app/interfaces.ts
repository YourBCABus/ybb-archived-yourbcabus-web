export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface School {
  _id: any;
  name?: string;
  location?: Coordinate;
  available: boolean;
}

export interface Bus {
  _id: any;
  school_id: string;
  name?: string;
  locations?: string[];
  boarding_time?: Date;
  departure_time?: Date;
  invalidate_time?: Date;
  available: boolean;
  other_names?: string[];
}
