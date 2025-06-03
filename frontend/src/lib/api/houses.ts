import { validatedGet, validatedGetList } from './client';
import { HouseSchema } from '../schemas/houses';

export const housesApi = {
  getAll: (params?: {
    status?: string;
    district?: string;
    page?: number;
    limit?: number;
  }) => validatedGetList('/houses', HouseSchema, params),

  getById: (id: number) => validatedGet(`/houses/${id}`, HouseSchema),
};