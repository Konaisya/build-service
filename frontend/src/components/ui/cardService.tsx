import "@/styles/cardService.css";
import { Button } from "./button";
import Link from "next/link";


export const statuses: Status[] = [
    { id: 1, name: "Available" },
    { id: 2, name: "Sold" },
    { id: 3, name: "Under Construction" },
];

type Houses = {
    id: number;
    title: string;
    description: string;
    images: string[];
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

export const balconyStatuses: BalconyStatus[] = [
    { id: 1, name: "Yes" }, 
    { id: 2, name: "No" }
]

export const bathroomStatuses: BathroomStatus[] = [
    { id: 1, name: "Combined" }, 
    { id: 2, name: "Separate" }   
];

type Apartment = {
    id: number;
    name: string;
    description: string;
    image: string;
    rooms: number;
    area: number;
    price: number;
    houseId?: number; 
    id_balcony?: {
        // id: number;
        balcony_status: BalconyStatus;
    }
    id_bathrooms?: {
        // id: number;
        bathroom_status: BathroomStatus; 
    }
};


export const apartments: Apartment[] = [
    {
        id: 1,
        name: "Квартира 1",
        description: "Spacious apartment with a great view",
        image: "apartment1.jpg",
        rooms: 3,
        area: 120,
        price: 100000,
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
        name: "Квартира 2",
        description: "Cozy and affordable",
        image: "apartment2.jpg",
        rooms: 2,
        area: 80,
        price: 75000,
        houseId: 1 
    },
    {
        id: 3,
        name: "Квартира 3",
        description: "Luxurious and spacious",
        image: "#",
        rooms: 4,
        area: 150,
        price: 150000,
        houseId: 1
    }
];

export const card_service: Houses[] = [
    {
        id: 1,
        title: "Хрущевка",
        description: "В этом доме ебашут дрелью тебе в ухо уебан, ты будешь страдать ведь кроме дрели тут еще и дети есть за стеной, весело тебе будет",
        images: ["house.jpg", "apart.jpg"],
        floors: 5,
        statusId: 3, 
        apartments: [1, 2] 
    },
    {
        id: 2,
        title: "Card 2",
        description: "This is card 2",
        images: ["https://picsum.photos/200/300"],
        floors: 10,
        statusId: 1, 
        apartments: [] 
    },
    {
        id: 3,
        title: "Card 3",
        description: "This is card 3",
        images: ["https://picsum.photos/200/300"],
        floors: 8,
        statusId: 2 
    }
];

const CardService = () => {
    return (
        <div className="card-container">
            {card_service.map((card) => (
                <div className="card" key={card.id}>
                    <img src={card.images[0]} alt={card.title} className="card-image" />
                    <div className="card-content">
                        <h3 className="card-title">{card.title}</h3>
                        <p className="card-description">{card.description}</p>
                        <Link href={`/services/${card.id}`}>
                            <Button className="card-button">Подробнее</Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardService;