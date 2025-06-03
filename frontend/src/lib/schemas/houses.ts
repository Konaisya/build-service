import { z } from 'zod';

export const HouseStatusSchema = z.enum([
  'PROJECT',
  'PLANNED',
  'IN_PROGRESS',
  'SUSPENDED',
  'BUILT',
  'FOR_SALE',
  'SOLD',
  'ARCHIVED',
]);

export const HouseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string().url()),
  district: z.string(),
  address: z.string().optional(),
  status: HouseStatusSchema,
  floors: z.number().int().positive().optional(),
  entrances: z.number().int().positive().optional(),
  start_price: z.number().positive().optional(),
  final_price: z.number().positive().optional(),
  is_order: z.boolean().default(false),
});

export type House = z.infer<typeof HouseSchema>;