"use client";

import React, { useState, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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

const ServiceDetailsClient = ({
  house,
  minRooms,
  maxRooms,
  groupedApartments,
}: {
  house: House;
  minRooms: number | null;
  maxRooms: number | null;
  groupedApartments: (Apartment & { names: string[] })[];
}) => {
  const [highlightedApartment, setHighlightedApartment] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const handleApartmentClick = (apartmentName: string) => {
    setHighlightedApartment(apartmentName);
    const apartmentElement = document.getElementById(apartmentName);
    if (apartmentElement) {
      apartmentElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setHighlightedApartment(null);
    }, 500);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? house.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === house.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollTopButton(true);
    } else {
      setShowScrollTopButton(false);
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, paddingRight: "20px" }}>
        <Link href={"/services"}>
          <Button className="button-back">Назад</Button>
        </Link>
        <div style={{ textAlign: "center" }}>
          <div className="house-container">
            <div className="house-content">
              <div className="carousel" style={{ position: "relative" }}>
                <Image
                  className="house-image"
                  src={`/${house.images[currentImageIndex]}`}
                  alt={house.title}
                  style={{ margin: "10px" }}
                  width={400}
                  height={400}
                  loading="lazy"
                />
                <Button
                  onClick={handlePrevClick}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    borderRadius: "50%",
                  }}
                >
                  &lt;
                </Button>
                <Button
                  onClick={handleNextClick}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    borderRadius: "50%",
                  }}
                >
                  &gt;
                </Button>
              </div>
              <div className="house-details">
                <h1 style={{ fontSize: "24px" }} className="house-title">
                  {house.title}
                </h1>
                <p>
                  <span style={{ fontWeight: "bold" }}>Описание: </span>
                  {house.description}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Этажей: </span> {house.floors}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Статус: </span>{" "}
                  {getStatusName(house.statusId)}
                </p>
                {groupedApartments.length > 0 && (
                  <>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Минимальное количество комнат: </span>
                      {minRooms}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Максимальное количество комнат: </span>
                      {maxRooms}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          {groupedApartments.length > 0 ? (
            <>
              <ul className="apartments-list">
                {groupedApartments.map((apartment) => (
                  <motion.li
                    id={apartment.names.join(",")}
                    className={`apartments-list-item ${
                      highlightedApartment === apartment.names.join(",") ? "highlighted" : ""
                    }`}
                    key={apartment.names.join(",")}
                    initial={{ y: 0 }}
                    animate={
                      highlightedApartment === apartment.names.join(",")
                        ? { y: [0, -10, 0] }
                        : { y: 0 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Image
                      src="/house.jpg"
                      width={400}
                      height={400}
                      className="apartments-list-image"
                      alt="House"
                      loading="lazy"
                    />
                    <div className="apartments-list-content">
                      <h3 className="apartments-list-h3">{apartment.names.join(", ")}</h3>
                      <p className="apartments-list-desk">{apartment.description}</p>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button className="button-open-apartment" variant="outline">
                            Подробнее
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Подробная информация о квартирах</SheetTitle>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="category" className="text-right">
                                Категория квартир
                              </Label>
                              <p className="col-span-2">{apartment.id_category?.categoryApartment.name}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="rooms" className="text-right">
                                Комнаты
                              </Label>
                              <p className="col-span-2">{apartment.rooms}</p>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="area" className="text-right">
                                Площадь
                              </Label>
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
                            <SheetClose asChild></SheetClose>
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
            onClick={() => handleApartmentClick(apartment.names.join(","))}
            style={{ marginBottom: "10px", width: "100%" }}
          >
            {apartment.names.join(", ")}
          </Button>
        ))}
      </div>
      <AnimatePresence>
        {showScrollTopButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
            }}
          >
            <Button
              onClick={handleScrollTop}
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                borderRadius: "50%",
              }}
            >
              ↑
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
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