import { z } from "zod";

export const HouseStatusSchema = z.enum([
  "PROJECT", 
  "PLANNED", 
  "IN_PROGRESS", 
  "SUSPENDED", 
  "BUILT", 
  "FOR_SALE", 
  "SOLD", 
  "ARCHIVED"
]);

export const ApartmentCategorySchema = z.enum(["LUXURY", "COMFORT", "ECONOMY"]);

export const HouseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  district: z.string(),
  address: z.string().optional(),
  status: HouseStatusSchema,
  floors: z.number().optional(),
  entrances: z.number().optional(),
  begin_date: z.string().optional(),
  end_date: z.string().optional(),
  start_price: z.number().optional(),
  final_price: z.number().optional(),
  is_order: z.boolean().optional(),
});

export const ApartmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  rooms: z.number(),
  area: z.number(),
  count: z.number().optional(),
  house_id: z.number(),
  category: ApartmentCategorySchema.optional(),
  has_balcony: z.boolean().optional(),
  bathroom_type: z.enum(["COMBINED", "SEPARATE"]).optional(),
});

export type House = z.infer<typeof HouseSchema>;
export type Apartment = z.infer<typeof ApartmentSchema>;