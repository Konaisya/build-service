import { apartments, card_service } from "@/components/ui/cardService"; 
import Image from "next/image";
import React from "react";

const ServiceDetails = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const houseId = parseInt(id, 10);
    const house = card_service.find((house) => house.id === houseId); 
    const filteredApartments = apartments.filter((apartment) => apartment.houseId === houseId);

    if (!house) {
        return (
            <div style={{ textAlign: "center" }}>
                <h1>Дом с ID {id} не найден</h1>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Детали дома: {house.title}</h1>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                {house.images.map((image, index) => (
                    <Image 
                        key={index} 
                        src={`/${image}`} 
                        alt={house.title} 
                        width={500} 
                        height={500} 
                        style={{ margin: "10px" }}
                    />
                ))}
            </div>
            <p>{house.description}</p>
            <p>Этажей: {house.floors}</p>
            <p>Статус: {getStatusName(house.statusId)}</p>
            
            {filteredApartments.length > 0 ? (
                <ul>
                    <h2>Квартиры в этом доме:</h2>
                    {filteredApartments.map((apartment) => (
                        <li style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px"}} key={apartment.id}> 
                            <h3>{apartment.name}</h3>
                            <p>{apartment.description}</p>
                            <p>Комнаты: {apartment.rooms}</p>
                            <p>Площадь: {apartment.area} м²</p>
                            <p>Цена: ${apartment.price}</p>
                            <p>Ванная комната: {apartment.id_bathrooms ? apartment.id_bathrooms.bathroom_status.name : "Нет информации"}</p>
                            <p>Балкон: {apartment.id_balcony ? apartment.id_balcony.balcony_status.name : "Нет информации"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет доступных квартир в этом доме.</p>
            )}
        </div>
    );
};

const getStatusName = (statusId?: number) => {
    switch (statusId) {
        case 1:
            return "Доступен";
        case 2:
            return "Продан";
        case 3:
            return "Строится";
        default:
            return "Неизвестный статус";
    }
};

const ServiceDetailsWithLoading = async (props: { params: { id: string } }) => {
    return (
        <React.Suspense fallback={<div>Загрузка данных...</div>}>
            <ServiceDetails {...props} />
        </React.Suspense>
    );
};

export default ServiceDetailsWithLoading;
