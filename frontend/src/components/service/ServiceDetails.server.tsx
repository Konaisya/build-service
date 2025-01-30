import { apartments, card_service } from "@/components/ui/cardService";

type House = {
  id: number;
  title: string;
  description: string;
  floors: number;
  statusId: number;
  images: string[];
};

type Apartment = {
  name: string;
  description: string;
  rooms: number;
  area: number;
  count: number;
  id_category?: { categoryApartment: { name: string } };
  id_bathrooms?: { bathroom_status: { name: string } };
  id_balcony?: { balcony_status: { name: string } };
};

export const getServiceDetails = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const houseId = parseInt(id, 10);
  const house = card_service.find((house) => house.id === houseId) as House | undefined;
  const filteredApartments = apartments.filter((apartment) => apartment.houseId === houseId) as Apartment[];

  if (!house) {
    throw new Error(`Дом с ID ${id} не найден`);
  }

  const roomCounts = filteredApartments.map((apartment) => apartment.rooms);
  const minRooms = roomCounts.length > 0 ? Math.min(...roomCounts) : null;
  const maxRooms = roomCounts.length > 0 ? Math.max(...roomCounts) : null;

  const groupedApartments = groupApartments(filteredApartments);

  return {
    house,
    minRooms,
    maxRooms,
    groupedApartments,
  };
};

const groupApartments = (apartments: Apartment[]): (Apartment & { names: string[] })[] => {
  const grouped = apartments.reduce((acc, apartment) => {
    const key = JSON.stringify({
      description: apartment.description,
      rooms: apartment.rooms,
      area: apartment.area,
      id_bathrooms: apartment.id_bathrooms ? apartment.id_bathrooms.bathroom_status.name : null,
      id_balcony: apartment.id_balcony ? apartment.id_balcony.balcony_status.name : null,
    });

    if (!acc[key]) {
      acc[key] = { ...apartment, names: [apartment.name] };
    } else {
      acc[key].names.push(apartment.name);
    }
    return acc;
  }, {} as { [key: string]: Apartment & { names: string[] } });

  return Object.values(grouped);
};