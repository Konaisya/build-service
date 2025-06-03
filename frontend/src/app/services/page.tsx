'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

import { MapPin, Home, Heater as ApartmentIcon } from 'lucide-react';

interface Attribute {
  attribute: { id: number; name: string; description: string };
  value: string;
}

interface Apartment {
  id: number;
  name: string;
  description: string;
  main_image: string;
  rooms: number;
  area: number;
  id_house: number;
  count: number;
  category: { id: number; name: string };
  parameters: { parameter: { id: number; name: string }; value: string }[];
  images: { id: number; image: string }[];
}

interface House {
  name: string;
  description: string;
  main_image: string;
  status: string;
  is_order: boolean;
  district: string;
  address: string;
  floors: number;
  entrances: number;
  begin_date: string;
  end_date: string;
  start_price: number;
  final_price: number;
  attributes: Attribute[];
  images: { id: number; image: string }[];
  apartments: Apartment[];
}

const statusTranslations: Record<string, string> = {
  PROJECT: 'Проект',
  PLANNED: 'Запланировано',
  IN_PROGRESS: 'В процессе',
  SUSPENDED: 'Приостановлено',
  BUILT: 'Построено',
  FOR_SALE: 'В продаже',
  SOLD: 'Продано',
  ARCHIVED: 'Архив',
};

function useMagnifier() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [backgroundPos, setBackgroundPos] = useState('50% 50%');
  const [isZoomed, setIsZoomed] = useState(false);

  function onMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setBackgroundPos(`${xPercent}% ${yPercent}%`);
  }

  function onMouseEnter() {
    setIsZoomed(true);
  }

  function onMouseLeave() {
    setIsZoomed(false);
    setBackgroundPos('50% 50%');
  }

  return {
    containerRef,
    backgroundPos,
    isZoomed,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
  };
}

function HouseSkeleton() {
  return (
    <div className="rounded-2xl shadow-lg border bg-white w-full max-w-md mx-auto animate-pulse p-4 space-y-4">
      <div className="bg-gray-300 rounded-t-2xl h-60 w-full" />
      <div className="h-6 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
      <div className="h-5 bg-gray-300 rounded w-1/2 mt-4" />
    </div>
  );
}

function HouseDetailsSkeleton() {
  return (
    <div className="max-w-5xl p-6 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="bg-gray-300 rounded-lg w-full md:w-[600px] h-[400px]" />
        <div className="flex flex-wrap gap-3 max-w-xs">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-300 rounded-lg w-24 h-16" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded my-2 w-full" />
          ))}
        </div>
        <div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded my-2 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HouseGallery() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'В продаже' | 'Продано'>('all');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://127.0.0.1:8000/api/houses/')
      .then((res) => setHouses(res.data))
      .catch((err) => console.error('Ошибка загрузки домов:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHouses = useMemo(() => {
    return houses.filter((house) => {
      const matchesSearch = house.name.toLowerCase().includes(searchTerm.toLowerCase());
      const statusRus = statusTranslations[house.status] || house.status;
      const matchesStatus = statusFilter === 'all' || statusRus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [houses, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Home size={32} />
          Новые проекты
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="border rounded-md px-4 py-2 w-full sm:w-64 bg-gray-300 animate-pulse h-10" />
          <div className="border rounded-md px-4 py-2 w-full sm:w-48 bg-gray-300 animate-pulse h-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {[...Array(6)].map((_, i) => (
            <HouseSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <Home size={32} />
        Новые проекты
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <input
          type="text"
          placeholder="Поиск по названию..."
          className="border rounded-md px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border rounded-md px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Все статусы</option>
          <option value="В продаже">В продаже</option>
          <option value="Продано">Продано</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {filteredHouses.length === 0 && <p className="col-span-full text-center text-gray-500">Домов не найдено</p>}

        {filteredHouses.map((house, index) => (
          <motion.div
            key={house.name + house.status + index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, ease: 'easeOut', duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl shadow-lg overflow-hidden border bg-white w-full max-w-md mx-auto"
          >
            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  className="w-full text-left cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <motion.div className="relative h-60 w-full" whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }}>
                    <Image
                      src={`http://127.0.0.1:8000/${house.main_image}`}
                      alt={house.name}
                      fill
                      className="object-cover rounded-t-2xl"
                      unoptimized
                    />
                  </motion.div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-1">{house.name}</h2>
                    <p className="text-gray-500 line-clamp-2">{house.description}</p>
                    <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin size={16} /> {house.district}
                    </p>
                  </div>
                </motion.button>
              </DialogTrigger>

              <DialogContent
                className="max-w-5xl max-h-[80vh] overflow-y-auto rounded-lg p-6"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
              >
                <DialogTitle className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Home size={24} /> {house.name}
                </DialogTitle>

                <HouseDetails house={house} />
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HouseDetails({ house }: { house: House }) {
  const [selectedImage, setSelectedImage] = useState(`http://127.0.0.1:8000/${house.main_image}`);
  const {
    containerRef,
    backgroundPos,
    isZoomed,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
  } = useMagnifier();

  const allImages = [{ id: -1, image: house.main_image }, ...house.images];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div
          ref={containerRef}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            width: 600,
            height: 400,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 12,
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            border: '1px solid #ddd',
            flexShrink: 0,
          }}
        >
          <motion.img
            src={selectedImage}
            alt="Изображение дома"
            className="w-full h-full object-cover"
            style={{
              transformOrigin: backgroundPos,
              transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
            draggable={false}
          />
        </div>

        <div className="flex flex-wrap gap-3 max-w-xs">
          {allImages.map((img) => {
            const imgUrl = `http://127.0.0.1:8000/${img.image}`;
            return (
              <img
                key={img.id}
                src={imgUrl}
                alt="миниатюра"
                className={`h-16 w-24 rounded-lg object-cover cursor-pointer transition-transform hover:scale-105 ${
                  selectedImage === imgUrl ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => setSelectedImage(imgUrl)}
                draggable={false}
              />
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm text-gray-700">
        <div>
          <p>
            <span className="font-semibold">Статус:</span> {statusTranslations[house.status] || house.status}
          </p>
          <p>
            <span className="font-semibold">Адрес:</span> {house.address}
          </p>
          <p>
            <span className="font-semibold">Район:</span> {house.district}
          </p>
          <p>
            <span className="font-semibold">Этажей:</span> {house.floors}
          </p>
          <p>
            <span className="font-semibold">Подъездов:</span> {house.entrances}
          </p>
          <p>
            <span className="font-semibold">Начало строительства:</span> {house.begin_date}
          </p>
          <p>
            <span className="font-semibold">Окончание строительства:</span> {house.end_date}
          </p>
          <p>
            <span className="font-semibold">Цена от:</span> {house.start_price.toLocaleString()} ₽
          </p>
          <p>
            <span className="font-semibold">Цена до:</span> {house.final_price.toLocaleString()} ₽
          </p>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Атрибуты:</h3>
            <ul className="list-disc list-inside space-y-1">
              {house.attributes.map((attr) => (
                <li key={attr.attribute.id}>
                  <strong>{attr.attribute.name}:</strong> {attr.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <ApartmentIcon size={18} />
            Квартиры:
          </h3>

          {house.apartments.length === 0 ? (
            <p className="text-gray-500 italic">Пока информация о квартирах недоступна</p>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-4">
              {house.apartments.map((apartment) => (
                <div
                  key={apartment.id}
                  className="border rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
                  title={apartment.description}
                >
                  <p className="font-semibold text-lg">
                    {apartment.name} — {apartment.rooms} комн, {apartment.area} м²
                  </p>
                  <p className="text-gray-600 mt-1 text-sm line-clamp-3">{apartment.description}</p>
                  <p className="mt-2 text-xs text-gray-400 italic">Категория: {apartment.category.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
