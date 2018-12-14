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
