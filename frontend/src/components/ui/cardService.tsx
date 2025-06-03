"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { House, HouseStatus } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function CardService() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await api.houses.getAll({
          limit: 10,
          status: "FOR_SALE,IN_PROGRESS",
        });
        setHouses(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading houses: {error}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-center p-6">
            <h3 className="text-xl font-bold text-white mb-4">Заказать услугу</h3>
            <Button size="lg" className="rounded-full h-16 w-16 text-2xl">
              +
            </Button>
          </div>
        </div>
      </motion.div>

      {houses.map((house) => (
        <HouseCard key={house.id} house={house} />
      ))}
    </motion.div>
  );
}

function HouseCard({ house }: { house: House }) {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
    >
      {house.images?.[0] && (
        <Image
          src={getImageUrl(house.images[0])}
          alt={house.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6 bg-white">
        <h3 className="text-xl font-bold mb-2">{house.title}</h3>
        <p className="text-gray-600 line-clamp-2 mb-4">{house.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {house.district}
          </span>
          {house.floors && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {house.floors} этажей
            </span>
          )}
          <span className={`px-2 py-1 text-xs rounded-full ${
            house.status === "FOR_SALE" 
              ? "bg-purple-100 text-purple-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {getStatusText(house.status)}
          </span>
        </div>

        <Link href={`/services/${house.id}`}>
          <Button className="w-full">Подробнее</Button>
        </Link>
      </div>
    </motion.div>
  );
}


function getImageUrl(imagePath: string): string {
  return imagePath.startsWith("http") ? imagePath : `/${imagePath}`;
}

function getStatusText(status: HouseStatus): string {
  const statusMap = {
    PROJECT: "Проект",
    PLANNED: "Запланирован",
    IN_PROGRESS: "Строится",
    SUSPENDED: "Приостановлено",
    BUILT: "Построен",
    FOR_SALE: "В продаже",
    SOLD: "Продан",
    ARCHIVED: "Архив",
  };
  return statusMap[status];
}