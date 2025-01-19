"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

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

const ServiceDetailsClient = ({ house, minRooms, maxRooms, groupedApartments }: { house: House; minRooms: number | null; maxRooms: number | null; groupedApartments: (Apartment & { names: string[] })[] }) => {
  const [highlightedApartment, setHighlightedApartment] = useState<string | null>(null);

  const handleApartmentClick = (apartmentName: string) => {
    setHighlightedApartment(apartmentName);
    const apartmentElement = document.getElementById(apartmentName);
    if (apartmentElement) {
      apartmentElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setHighlightedApartment(null);
    }, 3000);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, paddingRight: "20px" }}>
        <Link href={"/services"}><Button className="button-back">Назад</Button></Link>
        <div style={{ textAlign: "center" }}>
          <h1>Детали дома: {house.title}</h1>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {house.images.map((image, index) => (
              <Image
                key={index}
                src={`/${image}`}
                alt={house.title}
                style={{ margin: "10px" }}
                width={400}
                height={400}
              />
            ))}
          </div>
          <p>{house.description}</p>
          <p>Этажей: {house.floors}</p>
          <p>Статус: {getStatusName(house.statusId)}</p>

          {groupedApartments.length > 0 && (
            <>
              <p>Минимальное количество комнат: {minRooms}</p>
              <p>Максимальное количество комнат: {maxRooms}</p>
            </>
          )}

          {groupedApartments.length > 0 ? (
            <>
              <ul className="apartments-list">
                <h2 className="apartments-list-title">Квартиры в этом доме:</h2>
                {groupedApartments.map((apartment) => (
                  <motion.li
                    id={apartment.names.join(',')}
                    className={`apartments-list-item ${highlightedApartment === apartment.names.join(',') ? 'highlighted' : ''}`}
                    key={apartment.names.join(',')}
                    initial={{ y: 0 }}
                    animate={highlightedApartment === apartment.names.join(',') ? { y: [0, -10, 0] } : { y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Image src="/house.jpg" className="apartments-list-image" alt="House" />
                    <div className="apartments-list-content">
                      <h3 className="apartments-list-h3">{apartment.names.join(', ')}</h3>
                      <p className="apartments-list-desk">{apartment.description}</p>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button className="button-open-apartment" variant="outline" >Подробнее</Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Подробная информация о квартирах</SheetTitle>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="category" className="text-right">Категория квартир</Label>
                              <p className="col-span-2">{apartment.id_category?.categoryApartment.name}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="rooms" className="text-right">Комнаты</Label>
                              <p className="col-span-2">{apartment.rooms}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="area" className="text-right">Площадь</Label>
                              <p className="col-span-2">{apartment.area} м²</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="count" className="text-right">Количество</Label>
                              <p className="col-span-2">{apartment.count}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="bathrooms" className="text-right">Ванная комната</Label>
                              <p className="col-span-2">{apartment.id_bathrooms ? apartment.id_bathrooms.bathroom_status.name : "Нет информации"}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="balcony" className="text-right">Балкон</Label>
                              <p className="col-span-2">{apartment.id_balcony ? apartment.id_balcony.balcony_status.name : "Нет информации"}</p>
                            </div>
                          </div>
                          <SheetFooter>
                            <SheetClose asChild>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </>
          ) : (
            <p>No apartments available.</p>
          )}
        </div>
      </div>
      <div className="appartments-nav-button">
        {groupedApartments.map((apartment, index) => (
          <Button
            key={index}
            className="apartment-button"
            onClick={() => handleApartmentClick(apartment.names.join(','))}
            style={{ marginBottom: "10px", width: "100%" }}
          >
            {apartment.names.join(', ')}
          </Button>
        ))}
      </div>
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

export default ServiceDetailsClient;