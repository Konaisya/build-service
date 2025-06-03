export type HouseStatus = 
  | "PROJECT" 
  | "PLANNED" 
  | "IN_PROGRESS" 
  | "SUSPENDED" 
  | "BUILT" 
  | "FOR_SALE" 
  | "SOLD" 
  | "ARCHIVED";

export type ApartmentCategory = "LUXURY" | "COMFORT" | "ECONOMY";

export interface House {
  id: number;
  title: string;
  description: string;
  images: string[];
  district: string;
  address?: string;
  status: HouseStatus;
  floors?: number;
  entrances?: number;
  begin_date?: string; 
  end_date?: string;
  start_price?: number;
  final_price?: number;
  is_order?: boolean;
}

export interface Apartment {
  id: number;
  name: string;
  description: string;
  image: string;
  rooms: number;
  area: number;
  count?: number;
  house_id: number;
  category?: ApartmentCategory;
  has_balcony?: boolean;
  bathroom_type?: "COMBINED" | "SEPARATE";
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}