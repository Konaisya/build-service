import "@/styles/cardService.css";
import { Button } from "./button";


type CardService = {
    id: number;
    title: string;
    description: string;
    image: string;
}

export const card_service: CardService[] = [
    {
        id: 1,
        title: "Хрущевка",
        description: "В этом доме ебашут дрелью тебе в ухо уебан, ты будешь страдать ведь кроме дрели тут еще и дети есть за стеной, весело тебе будет",
        image: "house.jpg"
    },
    {
        id: 2,
        title: "Card 2",
        description: "This is card 2",
        image: "https://picsum.photos/200/300"
    },
    {
        id: 3,
        title: "Card 3",
        description: "This is card 3",
        image: "https://picsum.photos/200/300"
    }
];

const CardService = () => {
    return (
        <div className="card-container">
            {card_service.map((card) => (
                <div className="card" key={card.id}>
                    <img src={card.image} alt={card.title} className="card-image" />
                    <div className="card-content">
                        <h3 className="card-title">{card.title}</h3>
                        <p className="card-description">{card.description}</p>
                        <Button className="card-button">Подробнее</Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardService;
