import axios from "axios";
import {
  House,
  Apartment,
  HouseSchema,
  ApartmentSchema
} from "@/lib/schemas";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1/api",
  timeout: 10000,
});

apiClient.interceptors.response.use(response => {
  if (response.data?.data) {
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data.map((item: any) => 
          response.config.url?.includes("houses") 
            ? HouseSchema.parse(item) 
            : ApartmentSchema.parse(item)
        ),
      }
    };
  }
  return response;
});

export const api = {
  houses: {
    getAll: (params?: {
      name?: string;
      status?: string;
      district?: string;
      floors?: number;
      page?: number;
      limit?: number;
    }) => apiClient.get<{ data: House[]; total: number }>("/houses", { params }),
    
    getById: (id: number) => apiClient.get<House>(`/houses/${id}`),
  },
  
  apartments: {
    getByHouse: (houseId: number, params?: {
      rooms?: number;
      category?: string;
      page?: number;
      limit?: number;
    }) => apiClient.get<{ data: Apartment[]; total: number }>("/apartments", { 
      params: { ...params, house_id: houseId } 
    }),
    
    getById: (id: number) => apiClient.get<Apartment>(`/apartments/${id}`),
  },
};