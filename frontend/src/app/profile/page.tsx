'use client'
import "./style.css"
import { categoryApartment, balconyStatuses, bathroomStatuses, Houses, Apartment } from "@/components/ui/cardService"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import axios from "axios";
  import {API_USER} from '@/config/apiConfig'
  import { useRouter } from "next/navigation";
  



//  type Orders = {
//     id : number,
//     houses: {
//         id: number;
//         title: string;
//         description: string;
//         images: string[];
//         district: string;
//         floors?: number;
//         statusId?: number; 
//         apartments?: number[];
//         apartaments:{
//          id: number;
//             name: string;
//             description: string;
//             image: string;
//             rooms: number;
//             area: number;
//             count?: number;
//             id_category?: {
//                 categoryApartment: CategoryApartment;
//             }
//             houseId?: number; 
//             id_balcony?: {
//                 balcony_status: BalconyStatus;
//             }
//             id_bathrooms?: {
//                 bathroom_status: BathroomStatus; 
//             }
//         }
//     }
//         max_price?: number,
//         status?: string,
//         end_date?: string
// }


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

export const houses: Houses[] = [
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


type Profile = {
    id: number;
    email?:string;
    name: string;
    org_name: string;
}


const Profile = () => {
const headerRef = useRef<HTMLDivElement | null>(null);
const infoRef = useRef<HTMLDivElement | null>(null);
const [activeSection, setActiveSection] = useState<number>(0);
const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);
const [profile, setProfile] = useState<Profile | null>(null);
const router = useRouter();

const getProfile = async (access_token: string): Promise<Profile> => {
    const response = await axios.get<Profile>(API_USER + "me", {
        headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data;
};

useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
        console.error("Токен отсутствует");
        return;
    }
    axios
        .get("http://127.0.0.1:8000/api/auth/refresh", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        .then((response) => setProfile(response.data))
        .catch((error) => console.log("Ошибка:"));
}, []);

useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
        getProfile(access_token)
            .then(setProfile)
            .catch((error) => {
                console.log("Ошибка при получении профиля:");
                setProfile(null); 
            });
    }
}, []);

useEffect(()=> {
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
}, []);

const handleLogout = () => {
    localStorage.removeItem('access_token'); // Удаляем токен
    setProfile(null); // Сбрасываем состояние профиля
    router.push('/auth'); // Перенаправление на страницу входа
};



const handleNavigationClick = (index: number) => {
    setActiveSection(index);
    if (index === 0 && headerRef.current) {
        headerRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (index === 1 && infoRef.current) {
        infoRef.current.scrollIntoView({ behavior: "smooth" });
    }
};

const handleScroll = () => {
    console.log('Scroll position:', window.scrollY); 
    if (window.scrollY > 300) {
        setIsButtonVisible(false);
    } else {
        setIsButtonVisible(true);
    }
};



if (!profile) {
    return <div>Загрузка...</div>; 
}

return (  
    <>
        <div className="profile-container" ref={headerRef}>
            <div className="profile-img"></div>
                <div className="profile-info" >
                    <p>Имя пользователя: {profile.name}</p>
                    <span className="line"></span>
                    <p>Организация: {profile.org_name}</p>
                    <Button onClick={handleLogout} className="exit-btn">Выйти</Button>  
                    {isButtonVisible && ( 
                        <Button onClick={() => handleNavigationClick(1)} className="move-btn">К заказам</Button>
                    )}
                </div>
        </div> 

        <div className="order" ref={infoRef}>
            <div className="orders">
                <h1 className="order-title">Ваши заказы</h1>
                <ul>
                    {houses.map((order) => (
                        <li className="orders-ul-li" key={order.id}>          
                            <Dialog>
                                <DialogTrigger>
                                    <Image 
                                        width={400} 
                                        height={400} 
                                        src={order.images[0].startsWith('http') ? order.images[0] : `/${order.images[0]}`} 
                                        alt={order.title} 
                                    />
                                    <h1>Тип дома: {order.title}</h1>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Подробности</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>Район: {order.district}</DialogDescription>
                                    <DialogDescription>Этажи: {order.floors}</DialogDescription>
                                    <DialogDescription>Статус: {order.statusId}</DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </>
);
};

export default Profile;