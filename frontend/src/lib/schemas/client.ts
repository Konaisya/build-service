import axios from 'axios';
import z, { ZodSchema } from 'zod';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

export async function validatedGet<T>(
  endpoint: string,
  schema: ZodSchema<T>,
  params?: Record<string, unknown>
): Promise<T> {
  const response = await apiClient.get(endpoint, { params });
  return schema.parse(response.data);
}

export async function validatedGetList<T>(
  endpoint: string,
  schema: ZodSchema<T>,
  params?: Record<string, unknown>
): Promise<{ data: T[]; total: number }> {
  const response = await apiClient.get(endpoint, { params });
  return {
    data: z.array(schema).parse(response.data.data),
    total: response.data.total,
  };
}