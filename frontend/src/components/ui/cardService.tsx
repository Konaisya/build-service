import "@/styles/cardService.css";
import { Button } from "./button";
import Link from "next/link";
import Image from "next/image";

export const statuses: Status[] = [
    { id: 1, name: "Available" },
    { id: 2, name: "Sold" },
    { id: 3, name: "Under Construction" },
];

export type Houses = {
    id: number;
    title: string;
    description: string;
    images: string[];
    district:string;
    floors?: number;
    statusId?: number; 
    apartments?: number[];
};

type Status = {
    id: number;
    name: string;
};

type BathroomStatus = {
    id: number;
    name: string;
};

type BalconyStatus = {
    id: number;
    name: string;
}

type CategoryApartment = {
    id: number;
    name: string;
}

export const balconyStatuses: BalconyStatus[] = [
    { id: 1, name: "Yes" }, 
    { id: 2, name: "No" }
]

export const bathroomStatuses: BathroomStatus[] = [
    { id: 1, name: "Combined" }, 
    { id: 2, name: "Separate" }   
];

export const categoryApartment: CategoryApartment[] = [
    { id: 1, name: "Люкс" },
    { id: 2, name: "Средний класс" },
    { id: 3, name: "Эконом" }
];

export type Apartment = {
    id: number;
    name: string;
    description: string;
    image: string;
    rooms: number;
    area: number;
    count?: number;
    id_category?: {
        categoryApartment: CategoryApartment;
    }
    houseId?: number; 
    id_balcony?: {
        balcony_status: BalconyStatus;
    }
    id_bathrooms?: {
        bathroom_status: BathroomStatus; 
    }
};

export const apartments: Apartment[] = [
    {
        id: 1,
        name: "Квартиры люкс класса",
        description: "Spacious apartment with a great view Spacious apartment with a great viewSpacious apartment with a great viewSpacious apartment with a great viewSpacious apartment with a great viewSpacious apartment with a great viewSpacious apartment with a great viewSpacious apartment with a great view",
        image: "apartment1.jpg",
        rooms: 4,
        area: 120,
        count: 10,
        id_category: {
            categoryApartment: categoryApartment[0]
        },
        id_balcony: {
            balcony_status: balconyStatuses[0]
        },
        id_bathrooms: {
            bathroom_status: bathroomStatuses[0]
        },
        houseId: 1
    },
    {
        id: 2,
        name: "Квартиры среднего класса",
        description: "Cozy and affordable",
        image: "apartment2.jpg",
        id_category: {
            categoryApartment: categoryApartment[1]
        },
        rooms: 2,
        count: 30,
        area: 100,
        houseId: 2
    },
    {
        id: 3,
        name: "Квартиры эконом класса",
        description: "Luxurious and spacious",
        image: "#",
        id_category: {
            categoryApartment: categoryApartment[2]
        },
        count: 50,
        rooms: 4,
        area: 70,
        houseId: 1
    }
];

export const card_service: Houses[] = [
    {
        id: 1,
        title: "Хрущевка",
        district:"Ленинский",
        description: "В этом доме ебашут дрелью тебе в ухо уебан, ты будешь страдать ведь кроме дрели тут еще и дети есть за стеной, весело тебе будет",
        images: ["house.jpg", "apart.jpg"],
        floors: 5,
        statusId: 3, 
        apartments: [1, 2] 
    },
    {
        id: 2,
        title: "Card 2",
        district:"Кировский",
        description: "This is card 2",
        images: ["apart.jpg"],
        floors: 10,
        statusId: 1, 
        apartments: [] 
    },
    {
        id: 3,
        title: "Card 3",
        district:"Куйбышевский",
        description: "This is card 3",
        images: ["apart.jpg"],
        floors: 8,
        statusId: 2 
    }
];

const CardService = () => {
    return (
        <div className="card-container">
            <div className="card order-card">
                <div className="order-card-content">
                    <h3 className="order-card-title">Заказать услугу</h3>
                    <button className="order-button">+</button>
                </div>
            </div>
            {card_service.map((card) => (
                <div className="card" key={card.id}>
                    <Image 
                        width={400} 
                        height={400} 
                        src={card.images[0].startsWith('http') ? card.images[0] : `/${card.images[0]}`} 
                        alt={card.title} 
                        className="card-image" 
                    />
                    <div className="card-content">
                        <h3 className="card-title">{card.title}</h3>
                        <p className="card-description">{card.description}</p>
                        <Link href={`/services/${card.id}`} prefetch={true}>
                            <Button className="card-button">Подробнее</Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardService;