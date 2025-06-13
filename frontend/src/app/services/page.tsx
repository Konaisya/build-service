'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/api/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { MapPin, Home, Heater as ApartmentIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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

function NewHouseOrderModal({
  open,
  onClose,
  onOrderSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}) {
  const { accessToken } = useAuth();
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'PROJECT',
    is_order: true,
    district: '',
    address: '',
    floors: 1,
    entrances: 1,
    begin_date: '',
    end_date: '',
    start_price: 0,
    final_price: 0,
    attributes: [{ id_attribute: 0, value: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [allAttributes, setAllAttributes] = useState<{ id: number; name: string; description: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'main' | 'attributes'>('main');

  function calcEndDate(floors: number, entrances: number) {
    const months = Math.max(1, Number(floors) + Number(entrances));
    const start = new Date();
    start.setMonth(start.getMonth() + months);
    return start.toISOString().split('T')[0];
  }

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/house_attributes/')
      .then(res => setAllAttributes(res.data))
      .catch(() => setAllAttributes([]));
    setForm(f => {
      const begin = new Date().toISOString().split('T')[0];
      const end = calcEndDate(f.floors, f.entrances);
      return {
        ...f,
        begin_date: begin,
        end_date: end,
      };
    });
  }, []);


  useEffect(() => {
    setForm(f => ({
      ...f,
      end_date: calcEndDate(f.floors, f.entrances),
    }));
  }, [form.floors, form.entrances]);

  const FIXED_PRICE_PER_M2 = 144260;

  const calcPrice = useMemo(() => {
    const area = (Number(form.floors) || 0) * (Number(form.entrances) || 0) * 63.37;
    const base = area * FIXED_PRICE_PER_M2;
    let attrsSum = 0;
    for (const attr of form.attributes) {
      const num = Number(attr.value);
      if (!isNaN(num)) attrsSum += num;
    }
    return Math.round(base + attrsSum);
  }, [form.floors, form.entrances, form.attributes]);

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error('Для оформления заказа необходимо войти в систему.');
      return;
    }
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.district.trim() ||
      !form.address.trim() ||
      !form.floors ||
      !form.entrances
    ) {
      toast.error('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    setLoading(true);
    try {
      const nowDate = new Date().toISOString().split('T')[0];
      const payload: any = {
        id_house: 0,
        house: {
          ...form,
          begin_date: nowDate,
        },
        contract_price: calcPrice,
      };
      if (form.attributes && form.attributes.length > 0 && form.attributes.some(attr => attr.value !== '')) {
        payload.house.attributes = form.attributes.map(attr => ({
          id_attribute: attr.id_attribute,
          value: attr.value,
        }));
      } else {
        delete payload.house.attributes;
      }
      await axios.post(
        'http://127.0.0.1:8000/api/orders/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccess(true);
      toast.success('Заказ успешно оформлен!');
      setTimeout(() => {
        onOrderSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      toast.error('Ошибка при создании заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Заказать новый дом</DialogTitle>
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'main' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('main')}
          >
            Основное
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'attributes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('attributes')}
          >
            Атрибуты
          </button>
        </div>
        {activeTab === 'main' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Район</label>
              <Input
                value={form.district}
                onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Адрес</label>
              <Input
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Этажей</label>
                <Input
                  type="number"
                  min={1}
                  value={form.floors}
                  onChange={e => setForm(f => ({ ...f, floors: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Подъездов</label>
                <Input
                  type="number"
                  min={1}
                  value={form.entrances}
                  onChange={e => setForm(f => ({ ...f, entrances: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Дата начала</label>
                <Input
                  type="date"
                  value={form.begin_date}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  tabIndex={-1}
                  placeholder={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Дата окончания</label>
                <Input
                  type="date"
                  value={form.end_date}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  tabIndex={-1}
                  placeholder={form.end_date}
                />
              </div>
            </div>
            <div className="font-semibold text-lg mt-6">
              Итоговая цена: <span className="text-blue-600">{calcPrice.toLocaleString()} ₽</span>
            </div>
          </div>
        )}
           {activeTab === 'attributes' && (
          <div>
            <label className="block text-sm font-medium mb-1">Атрибуты</label>
            
            {form.attributes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4 text-gray-500"
              >
                Атрибуты не добавлены
              </motion.div>
            )}

            <motion.div 
              layout
              className="space-y-2 max-h-[300px] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarGutter: 'stable',
              }}
            >
              {form.attributes.map((attr, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2 items-center overflow-hidden"
                >
                  <select
                    value={attr.id_attribute}
                    onChange={e => {
                      const attrs = [...form.attributes];
                      attrs[idx].id_attribute = Number(e.target.value);
                      setForm(f => ({ ...f, attributes: attrs }));
                    }}
                    className="w-56 border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    style={{ minHeight: 38 }}
                  >
                    <option value={0}>Выберите атрибут</option>
                    {allAttributes.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Значение"
                    value={attr.value}
                    onChange={e => {
                      const attrs = [...form.attributes];
                      attrs[idx].value = e.target.value;
                      setForm(f => ({ ...f, attributes: attrs }));
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setForm(f => ({
                        ...f,
                        attributes: f.attributes.filter((_, i) => i !== idx),
                      }));
                    }}
                  >
                    Удалить
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 sticky bottom-0 bg-white pt-2 pb-4"
            >
              <Button
                size="sm"
                className="w-full"
                onClick={() =>
                  setForm(f => ({
                    ...f,
                    attributes: [...f.attributes, { id_attribute: 0, value: '' }],
                  }))
                }
              >
                Добавить атрибут
              </Button>
            </motion.div>
            <div className="font-semibold text-lg mt-6">
              Итоговая цена: <span className="text-blue-600">{calcPrice.toLocaleString()} ₽</span>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !accessToken}>
            {loading ? 'Оформление...' : 'Оформить заказ'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HouseGallery() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'В продаже' | 'Продано'>('all');
  const [newHouseOrderOpen, setNewHouseOrderOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [tab, setTab] = useState<'planned' | 'built' | 'sold'>('planned');

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

  const plannedHouses = filteredHouses.filter(
    (h) => h.status === 'PLANNED'
  );
  const builtHouses = filteredHouses.filter(
    (h) => h.status === 'BUILT' || h.status === 'FOR_SALE'
  );
  const soldHouses = filteredHouses.filter(
    (h) => h.status === 'SOLD'
  );
  const archivedHouses = filteredHouses.filter(
    (h) => h.status === 'ARCHIVED'
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Home size={32} />
          Проекты
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
        Проекты
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

      <div className="col-span-full w-full mb-10">
        <div className="rounded-2xl shadow-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Заказать строительство дома</h2>
          <p className="text-gray-600 mb-6 text-center text-lg max-w-2xl">
            Оформите индивидуальный заказ на строительство дома с нужными параметрами, атрибутами и квартирами.
          </p>
          <Button
            size="lg"
            className="w-full max-w-xs text-lg"
            onClick={() => setNewHouseOrderOpen(true)}
          >
            Создать заказ
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={v => setTab(v as any)} className="w-full">
        <TabsList className="mb-8 flex justify-center">
          <TabsTrigger value="planned" className="text-lg px-6">Запланированные</TabsTrigger>
          <TabsTrigger value="built" className="text-lg px-6">Построенные</TabsTrigger>
          <TabsTrigger value="sold" className="text-lg px-6">Портфолио</TabsTrigger>
        </TabsList>
        <TabsContent value="planned">
          <Section title="" houses={plannedHouses} />
        </TabsContent>
        <TabsContent value="built">
          <Section title="" houses={builtHouses} />
        </TabsContent>
        <TabsContent value="sold">
          <Section title="" houses={soldHouses} />
        </TabsContent>
      </Tabs>

      <NewHouseOrderModal
        open={newHouseOrderOpen}
        onClose={() => setNewHouseOrderOpen(false)}
        onOrderSuccess={() => setOrderSuccess(true)}
      />
      {orderSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow">
          Заказ успешно создан!
        </div>
      )}
    </div>
  );
}

function Section({ title, houses }: { title: string; houses: House[] }) {
  if (houses.length === 0) return (
    <div className="text-center text-gray-500 py-12">Домов не найдено</div>
  );
  return (
    <div className="mb-12">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {houses.map((house, index) => (
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
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin size={16} /> {house.district}
                      </span>
                      <span className="text-blue-700 font-bold text-lg">
                        {house.start_price ? house.start_price.toLocaleString() + ' ₽' : ''}
                      </span>
                    </div>
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
