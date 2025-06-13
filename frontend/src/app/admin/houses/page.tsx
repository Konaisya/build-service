'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/api/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit, Image as ImageIcon, Home, MapPin, Layers, DoorOpen, Calendar, DollarSign, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import AdminSidebar from '@/components/ui/adminSidebbar';

type Attribute = {
  attribute: {
    id: number;
    name: string;
    description: string;
  };
  value: string;
};

type ApartmentParameter = {
  parameter: {
    id: number;
    name: string;
  };
  value: string;
};

type ApartmentCategory = {
  id: number;
  name: string;
};

type ApartmentImage = {
  id: number;
  image: string;
};

type Apartment = {
  id: number;
  name: string;
  description: string;
  main_image: string;
  rooms: number;
  area: number;
  id_house: number;
  count: number;
  category: ApartmentCategory;
  parameters: ApartmentParameter[];
  images: ApartmentImage[];
};

type HouseImage = {
  id: number;
  image: string;
};

type House = {
  id: number;
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
  images: HouseImage[];
  apartments: Apartment[];
};

const statusOptions = [
  { value: 'PROJECT', label: 'Проект', color: 'bg-gray-400' },
  { value: 'PLANNED', label: 'Запланирован', color: 'bg-blue-400' },
  { value: 'IN_PROGRESS', label: 'В строительстве', color: 'bg-yellow-400' },
  { value: 'SUSPENDED', label: 'Приостановлен', color: 'bg-red-400' },
  { value: 'BUILT', label: 'Построен', color: 'bg-green-400' },
  { value: 'FOR_SALE', label: 'В продаже', color: 'bg-purple-400' },
  { value: 'SOLD', label: 'Продан', color: 'bg-indigo-400' },
  { value: 'ARCHIVED', label: 'Архивирован', color: 'bg-gray-600' },
];

const ApartmentParametersManager = ({
  parameters,
  availableParameters,
  onAddParameter,
  onRemoveParameter,
  onParameterChange
}: {
  parameters: { id_parameter: number; value: string }[];
  availableParameters: { id: number; name: string }[];
  onAddParameter: (id: number) => void;
  onRemoveParameter: (id: number) => void;
  onParameterChange: (id: number, value: string) => void;
}) => {
  const [selectedParamId, setSelectedParamId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        {/* Заменить Select на обычный select */}
        <select
          className="w-[180px] border rounded px-2 py-1"
          value={selectedParamId?.toString() || ''}
          onChange={(e) => setSelectedParamId(Number(e.target.value))}
        >
          <option value="">Выберите параметр</option>
          {availableParameters
            .filter(param => !parameters.some(p => p.id_parameter === param.id))
            .map(param => (
              <option key={param.id} value={param.id.toString()}>
                {param.name}
              </option>
            ))}
        </select>
        <Button
          onClick={() => {
            if (selectedParamId) {
              onAddParameter(selectedParamId);
              setSelectedParamId(null);
            }
          }}
          disabled={!selectedParamId}
        >
          Добавить параметр
        </Button>
      </div>

      <div className="space-y-2">
        {parameters.map(param => {
          const paramName = availableParameters.find(p => p.id === param.id_parameter)?.name || 'Неизвестный параметр';
          return (
            <div key={param.id_parameter} className="flex items-center gap-2">
              <span className="w-40 truncate">{paramName}:</span>
              <Input
                value={param.value}
                onChange={(e) => onParameterChange(param.id_parameter, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveParameter(param.id_parameter)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HouseAttributesManager = ({
  attributes,
  availableAttributes,
  onAddAttribute,
  onRemoveAttribute,
  onAttributeChange
}: {
  attributes: Attribute[];
  availableAttributes: { id: number; name: string; description: string }[];
  onAddAttribute: (id: number) => void;
  onRemoveAttribute: (id: number) => void;
  onAttributeChange: (id: number, value: string) => void;
}) => {
  const [selectedAttrId, setSelectedAttrId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        {/* Заменить Select на обычный select */}
        <select
          className="w-[180px] border rounded px-2 py-1"
          value={selectedAttrId?.toString() || ''}
          onChange={(e) => setSelectedAttrId(Number(e.target.value))}
        >
          <option value="">Выберите атрибут</option>
          {availableAttributes
            .filter(attr => !attributes.some(a => a.attribute.id === attr.id))
            .map(attr => (
              <option key={attr.id} value={attr.id.toString()}>
                {attr.name}
              </option>
            ))}
        </select>
        <Button
          onClick={() => {
            if (selectedAttrId) {
              onAddAttribute(selectedAttrId);
              setSelectedAttrId(null);
            }
          }}
          disabled={!selectedAttrId}
        >
          Добавить атрибут
        </Button>
      </div>

      <div className="space-y-2">
        {attributes.map(attr => (
          <div key={attr.attribute.id} className="flex items-center gap-2">
            <div className="w-40">
              <p className="font-medium">{attr.attribute.name}</p>
              <p className="text-xs text-gray-500">{attr.attribute.description}</p>
            </div>
            <Input
              value={attr.value}
              onChange={(e) => onAttributeChange(attr.attribute.id, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveAttribute(attr.attribute.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminHousesPage = () => {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [houses, setHouses] = useState<House[]>([]);
  const [categories, setCategories] = useState<ApartmentCategory[]>([]);
  const [parameters, setParameters] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [isCreateHouseModalOpen, setIsCreateHouseModalOpen] = useState(false);
  const [isEditHouseModalOpen, setIsEditHouseModalOpen] = useState(false);
  const [isHouseImageModalOpen, setIsHouseImageModalOpen] = useState(false);
  const [isDeleteHouseModalOpen, setIsDeleteHouseModalOpen] = useState(false);
  const [isCreateApartmentModalOpen, setIsCreateApartmentModalOpen] = useState(false);
  const [isEditApartmentModalOpen, setIsEditApartmentModalOpen] = useState(false);
  const [isApartmentImageModalOpen, setIsApartmentImageModalOpen] = useState(false);
  const [isDeleteApartmentModalOpen, setIsDeleteApartmentModalOpen] = useState(false);
  const [isHouseInfoModalOpen, setIsHouseInfoModalOpen] = useState(false);
  const [isCreateAttributeModalOpen, setIsCreateAttributeModalOpen] = useState(false);
  
  const [currentHouse, setCurrentHouse] = useState<House | null>(null);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedHouseId, setExpandedHouseId] = useState<number | null>(null);

  const [houseForm, setHouseForm] = useState({
    name: '',
    description: '',
    status: 'PROJECT',
    is_order: false,
    district: '',
    address: '',
    floors: 0,
    entrances: 0,
    begin_date: '',
    end_date: '',
    start_price: 0,
    final_price: 0,
    attributes: [] as Attribute[],
  });

  const [apartmentForm, setApartmentForm] = useState({
    name: '',
    description: '',
    id_category: 0,
    rooms: 0,
    area: 0,
    id_house: 0,
    count: 0,
    parameters: [] as { id_parameter: number; value: string }[],
  });

  const [houseImageFile, setHouseImageFile] = useState<File | null>(null);
  const [apartmentImageFile, setApartmentImageFile] = useState<File | null>(null);
  const [newAttributeForm, setNewAttributeForm] = useState({ name: '', description: '' });

  const fetchData = async () => {
    if (!accessToken) return;
    try {
      if (isInitialLoading) setLoading(true);
      const [housesRes, categoriesRes, parametersRes, attributesRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/houses/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get('http://127.0.0.1:8000/api/apartment_category/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get('http://127.0.0.1:8000/api/apartment_parameters/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get('http://127.0.0.1:8000/api/house_attributes/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      const validHouses = housesRes.data.map((house: any) => ({
        ...house,
        apartments: house.apartments || [],
        images: house.images || [],
        attributes: house.attributes || []
      }));

      setHouses(validHouses);
      setCategories(categoriesRes.data);
      setParameters(parametersRes.data);
      setAttributes(attributesRes.data);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    setIsInitialLoading(true);
    fetchData();
  }, [accessToken]);

  const handleHouseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHouseForm(prev => ({
      ...prev,
      [name]: ['floors', 'entrances', 'start_price', 'final_price'].includes(name) 
        ? Number(value) 
        : value,
    }));
  };

  const handleCreateHouse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/houses/', {
        ...houseForm,
        attributes: houseForm.attributes.map(attr => ({
          id_attribute: attr.attribute.id,
          value: attr.value
        }))
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsCreateHouseModalOpen(false);
      toast.success('Дом успешно создан');
      resetHouseForm();
      await fetchData();
    } catch (err) {
      toast.error('Ошибка при создании дома');
      console.error(err);
    }
  };

  const handleUpdateHouse = async () => {
    if (!currentHouse) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/houses/${currentHouse.id}`, {
        ...houseForm,
        attributes: houseForm.attributes.map(attr => ({
          id_attribute: attr.attribute.id,
          value: attr.value
        }))
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsEditHouseModalOpen(false);
      toast.success('Дом успешно обновлен');
      await fetchData();
    } catch (err) {
      toast.error('Ошибка при обновлении дома');
      console.error(err);
    }
  };

  const handleDeleteHouse = async () => {
    if (!currentHouse) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/houses/${currentHouse.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsDeleteHouseModalOpen(false);
      toast.success('Дом успешно удален');
      await fetchData();
    } catch (err) {
      toast.error('Ошибка при удалении дома');
      console.error(err);
    }
  };

  const handleHouseImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHouseImageFile(e.target.files[0]);
    }
  };

  const handleAddHouseImage = async () => {
    if (!currentHouse || !houseImageFile) return;
    try {
      const formData = new FormData();
      formData.append('images', houseImageFile);
      await axios.post(`http://127.0.0.1:8000/api/houses/${currentHouse.id}/images`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const res = await axios.get(`http://127.0.0.1:8000/api/houses/${currentHouse.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setHouses(houses.map(house => house.id === currentHouse.id ? res.data : house));
      setHouseImageFile(null);
      toast.success('Изображение добавлено');
    } catch (err) {
      toast.error('Ошибка при добавлении изображения');
      console.error(err);
    }
  };

  const handleDeleteHouseImage = async (imageId: number) => {
    if (!currentHouse) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/houses/${currentHouse.id}/images`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { ids_images: [imageId] },
      });
      const res = await axios.get(`http://127.0.0.1:8000/api/houses/${currentHouse.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setHouses(houses.map(house => house.id === currentHouse.id ? res.data : house));
      toast.success('Изображение удалено');
    } catch (err) {
      toast.error('Ошибка при удалении изображения');
      console.error(err);
    }
  };

  const handleSetMainHouseImage = async (imageUrl: string) => {
    if (!currentHouse) return;
    try {
      await axios.patch(`http://127.0.0.1:8000/api/houses/${currentHouse.id}/images`, {
        main_image: imageUrl,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const res = await axios.get(`http://127.0.0.1:8000/api/houses/${currentHouse.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setHouses(houses.map(house => house.id === currentHouse.id ? res.data : house));
      toast.success('Основное изображение обновлено');
    } catch (err) {
      toast.error('Ошибка при обновлении основного изображения');
      console.error(err);
    }
  };

  const handleApartmentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApartmentForm(prev => ({
      ...prev,
      [name]: ['rooms', 'area', 'id_house', 'count', 'id_category'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleCreateApartment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/apartments/', apartmentForm, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsCreateApartmentModalOpen(false);
      toast.success('Апартамент успешно создан');
      resetApartmentForm();
      await fetchData();
    } catch (err) {
      toast.error('Ошибка при создании апартамента');
      console.error(err);
    }
  };

  const handleUpdateApartment = async () => {
    if (!currentApartment) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/apartments/${currentApartment.id}`, apartmentForm, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsEditApartmentModalOpen(false);
      toast.success('Апартамент успешно обновлен');
      await fetchData();
    } catch (err) {
      toast.error('Ошибка при обновлении апартамента');
      console.error(err);
    }
  };

  const handleDeleteApartment = async () => {
    if (!currentApartment) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/apartments/${currentApartment.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsDeleteApartmentModalOpen(false);
      toast.success('Апартамент успешно удален');
      await fetchData();
    } catch (err) {
      toast.error('Ошибка при удалении апартамента');
      console.error(err);
    }
  };

  const handleApartmentImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApartmentImageFile(e.target.files[0]);
    }
  };

  const handleAddApartmentImage = async () => {
    if (!currentApartment || !apartmentImageFile) return;
    try {
      const formData = new FormData();
      formData.append('images', apartmentImageFile);
      await axios.post(`http://127.0.0.1:8000/api/apartments/${currentApartment.id}/images`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const updatedHouses = houses.map(house => {
        if (house.id === currentApartment.id_house) {
          const updatedApartments = house.apartments.map(apt => {
            if (apt.id === currentApartment.id) {
              return { ...apt, images: [...apt.images, { id: Date.now(), image: URL.createObjectURL(apartmentImageFile) }] };
            }
            return apt;
          });
          return { ...house, apartments: updatedApartments };
        }
        return house;
      });
      
      setHouses(updatedHouses);
      setApartmentImageFile(null);
      toast.success('Изображение добавлено');
    } catch (err) {
      toast.error('Ошибка при добавлении изображения');
      console.error(err);
    }
  };

  const handleDeleteApartmentImage = async (imageId: number) => {
    if (!currentApartment) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/apartments/${currentApartment.id}/images`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { ids_images: [imageId] },
      });
      
      const updatedHouses = houses.map(house => {
        if (house.id === currentApartment.id_house) {
          const updatedApartments = house.apartments.map(apt => {
            if (apt.id === currentApartment.id) {
              return { ...apt, images: apt.images.filter(img => img.id !== imageId) };
            }
            return apt;
          });
          return { ...house, apartments: updatedApartments };
        }
        return house;
      });
      
      setHouses(updatedHouses);
      toast.success('Изображение удалено');
    } catch (err) {
      toast.error('Ошибка при удалении изображения');
      console.error(err);
    }
  };

  const handleSetMainApartmentImage = async (imageUrl: string) => {
    if (!currentApartment) return;
    try {
      await axios.patch(`http://127.0.0.1:8000/api/apartments/${currentApartment.id}/images`, {
        main_image: imageUrl,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const updatedHouses = houses.map(house => {
        if (house.id === currentApartment.id_house) {
          const updatedApartments = house.apartments.map(apt => {
            if (apt.id === currentApartment.id) {
              return { ...apt, main_image: imageUrl };
            }
            return apt;
          });
          return { ...house, apartments: updatedApartments };
        }
        return house;
      });
      
      setHouses(updatedHouses);
      toast.success('Основное изображение обновлено');
    } catch (err) {
      toast.error('Ошибка при обновлении основного изображения');
      console.error(err);
    }
  };

  const handleCreateAttribute = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/house_attributes/', newAttributeForm, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setIsCreateAttributeModalOpen(false);
      setNewAttributeForm({ name: '', description: '' });
      toast.success('Атрибут успешно добавлен');
      await fetchData();
    } catch (err) {
      toast.error('Ошибка при добавлении атрибута');
      console.error(err);
    }
  };

  const resetHouseForm = () => {
    setHouseForm({
      name: '',
      description: '',
      status: 'PROJECT',
      is_order: false,
      district: '',
      address: '',
      floors: 0,
      entrances: 0,
      begin_date: '',
      end_date: '',
      start_price: 0,
      final_price: 0,
      attributes: [],
    });
  };

  const resetApartmentForm = () => {
    setApartmentForm({
      name: '',
      description: '',
      id_category: 0,
      rooms: 0,
      area: 0,
      id_house: 0,
      count: 0,
      parameters: [],
    });
  };

  const filteredHouses = houses.filter(house => {
    const name = house.name ?? '';
    const address = house.address ?? '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter && statusFilter !== "none" ? house.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-400';
  };

  const toggleExpandHouse = (id: number) => {
    setExpandedHouseId(expandedHouseId === id ? null : id);
  };

  if (loading && isInitialLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-2xl">Загрузка данных...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-500 text-xl">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <h1 className="text-2xl font-bold">Управление домами</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input
              placeholder="Поиск по названию или адресу"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            
            <select
              className="min-w-[180px] border rounded px-2 py-1"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">Все статусы</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button 
              onClick={() => setIsCreateHouseModalOpen(true)} 
              className="gap-2"
            >
              <Plus size={18} />
              Добавить дом
            </Button>
          </div>
        </div>

        {filteredHouses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Home className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-500">Дома не найдены</h3>
            <p className="text-gray-400 mb-4">Попробуйте изменить параметры поиска</p>
            <Button onClick={() => { setSearchTerm(''); setStatusFilter(''); }}>
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start auto-rows-max">
            {filteredHouses.map((house, houseIdx) => {
              const isExpanded = expandedHouseId === house.id;
              return (
                <div key={house.id ?? `house-${houseIdx}`}>
                  <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow w-full">
                    {house.main_image && (
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={`http://127.0.0.1:8000/${house.main_image}`}
                          alt={house.name}
                          fill
                          className="object-cover rounded-t-lg"
                          unoptimized
                          priority
                        />
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(house.status)}`}>
                          {statusOptions.find(s => s.value === house.status)?.label}
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span>{house.name}</span>
                        <span className="text-lg font-bold">
                          {house.final_price ? `${house.final_price.toLocaleString()} ₽` : '—'}
                        </span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4" />
                        {house.district}, {house.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gray-500" />
                        {house.floors} этажей
                      </div>
                      <div className="flex items-center gap-2">
                        <DoorOpen className="w-4 h-4 text-gray-500" />
                        {house.entrances} подъездов
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {house.begin_date || '—'}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        От {house.start_price ? `${house.start_price.toLocaleString()} ₽` : '—'}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-end gap-2">
                      <div className="flex gap-2 flex-wrap w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExpandHouse(house.id ?? 0)}
                          className="flex-1 min-w-[120px]"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          )}
                          {isExpanded ? 'Свернуть' : 'Подробнее'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentHouse(house);
                            setHouseForm({
                              name: house.name,
                              description: house.description,
                              status: house.status,
                              is_order: house.is_order,
                              district: house.district,
                              address: house.address,
                              floors: house.floors,
                              entrances: house.entrances,
                              begin_date: house.begin_date,
                              end_date: house.end_date,
                              start_price: house.start_price,
                              final_price: house.final_price,
                              attributes: house.attributes
                            });
                            setIsEditHouseModalOpen(true);
                          }}
                          className="flex-1 min-w-[120px]"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Редактировать
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentHouse(house);
                            setIsHouseImageModalOpen(true);
                          }}
                          className="flex-1 min-w-[120px]"
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Изображения
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setCurrentHouse(house);
                            setIsDeleteHouseModalOpen(true);
                          }}
                          className="flex-1 min-w-[120px]"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </Button>
                      </div>
                    </CardFooter>

                    {isExpanded && (
                      <div className="p-4 border-t bg-white">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Апартаменты в этом доме</h3>
                          <Button
                            size="sm"
                            onClick={() => {
                              setCurrentHouse(house);
                              setApartmentForm({
                                ...apartmentForm,
                                id_house: house.id ?? 0
                              });
                              setIsCreateApartmentModalOpen(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Добавить апартамент
                          </Button>
                        </div>
                        
                        {house.apartments.length === 0 ? (
                          <p className="text-sm text-gray-500">Нет апартаментов</p>
                        ) : (
                          <div className="space-y-3">
                            {house.apartments.map((apartment, aptIdx) => (
                              <div key={apartment.id ?? `apt-${aptIdx}`} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium">{apartment.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {apartment.rooms} комн. • {apartment.area} м² • {apartment.count} шт.
                                    </p>
                                    {apartment.description && (
                                      <p className="text-xs text-gray-500 mt-1">{apartment.description}</p>
                                    )}
                                  </div>
                                  <Badge variant="outline">
                                    {apartment.category?.name ?? '—'}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentApartment(apartment);
                                      setIsApartmentImageModalOpen(true);
                                    }}
                                    className="flex-1 min-w-[120px] max-w-full"
                                  >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Изображения
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentApartment(apartment);
                                      setApartmentForm({
                                        name: apartment.name,
                                        description: apartment.description,
                                        id_category: apartment.category.id,
                                        rooms: apartment.rooms,
                                        area: apartment.area,
                                        id_house: apartment.id_house,
                                        count: apartment.count,
                                        parameters: apartment.parameters.map(p => ({
                                          id_parameter: p.parameter.id,
                                          value: p.value
                                        })),
                                      });
                                      setIsEditApartmentModalOpen(true);
                                    }}
                                    className="flex-1 min-w-[120px] max-w-full"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Редактировать
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentApartment(apartment);
                                      setIsDeleteApartmentModalOpen(true);
                                    }}
                                    className="flex-1 min-w-[120px] max-w-full"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Удалить
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
            <AdminSidebar />
          </div>
          
        )}

        <Dialog open={isCreateHouseModalOpen} onOpenChange={setIsCreateHouseModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Добавить новый дом</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название</label>
                <Input
                  name="name"
                  value={houseForm.name}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Статус</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={houseForm.status}
                  onChange={e => setHouseForm({ ...houseForm, status: e.target.value })}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Район</label>
                <Input
                  name="district"
                  value={houseForm.district}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Адрес</label>
                <Input
                  name="address"
                  value={houseForm.address}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество этажей</label>
                <Input
                  type="number"
                  name="floors"
                  value={houseForm.floors}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество подъездов</label>
                <Input
                  type="number"
                  name="entrances"
                  value={houseForm.entrances}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата начала</label>
                <Input
                  type="date"
                  name="begin_date"
                  value={houseForm.begin_date}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата окончания</label>
                <Input
                  type="date"
                  name="end_date"
                  value={houseForm.end_date}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Начальная цена</label>
                <Input
                  type="number"
                  name="start_price"
                  value={houseForm.start_price}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Финальная цена</label>
                <Input
                  type="number"
                  name="final_price"
                  value={houseForm.final_price}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  name="description"
                  value={houseForm.description}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Атрибуты</label>
                <HouseAttributesManager
                  attributes={houseForm.attributes}
                  availableAttributes={attributes}
                  onAddAttribute={(id) => {
                    const attribute = attributes.find(a => a.id === id);
                    if (attribute) {
                      setHouseForm(prev => ({
                        ...prev,
                        attributes: [
                          ...prev.attributes,
                          {
                            attribute: {
                              id: attribute.id,
                              name: attribute.name,
                              description: attribute.description
                            },
                            value: ''
                          }
                        ]
                      }));
                    }
                  }}
                  onRemoveAttribute={(id) => {
                    setHouseForm(prev => ({
                      ...prev,
                      attributes: prev.attributes.filter(a => a.attribute.id !== id)
                    }));
                  }}
                  onAttributeChange={(id, value) => {
                    setHouseForm(prev => ({
                      ...prev,
                      attributes: prev.attributes.map(a => 
                        a.attribute.id === id ? { ...a, value } : a
                      )
                    }));
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setIsCreateAttributeModalOpen(true)}
                >
                  + Добавить новый атрибут
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateHouseModalOpen(false)}>
                Отмена
              </Button>
              <Button type="button" onClick={handleCreateHouse}>Создать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditHouseModalOpen} onOpenChange={setIsEditHouseModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Редактировать дом</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название</label>
                <Input
                  name="name"
                  value={houseForm.name}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Статус</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={houseForm.status}
                  onChange={e => setHouseForm({ ...houseForm, status: e.target.value })}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Район</label>
                <Input
                  name="district"
                  value={houseForm.district}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Адрес</label>
                <Input
                  name="address"
                  value={houseForm.address}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество этажей</label>
                <Input
                  type="number"
                  name="floors"
                  value={houseForm.floors}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество подъездов</label>
                <Input
                  type="number"
                  name="entrances"
                  value={houseForm.entrances}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата начала</label>
                <Input
                  type="date"
                  name="begin_date"
                  value={houseForm.begin_date}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата окончания</label>
                <Input
                  type="date"
                  name="end_date"
                  value={houseForm.end_date}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Начальная цена</label>
                <Input
                  type="number"
                  name="start_price"
                  value={houseForm.start_price}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Финальная цена</label>
                <Input
                  type="number"
                  name="final_price"
                  value={houseForm.final_price}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  name="description"
                  value={houseForm.description}
                  onChange={handleHouseInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Атрибуты</label>
                <HouseAttributesManager
                  attributes={houseForm.attributes}
                  availableAttributes={attributes}
                  onAddAttribute={(id) => {
                    const attribute = attributes.find(a => a.id === id);
                    if (attribute) {
                      setHouseForm(prev => ({
                        ...prev,
                        attributes: [
                          ...prev.attributes,
                          {
                            attribute: {
                              id: attribute.id,
                              name: attribute.name,
                              description: attribute.description
                            },
                            value: ''
                          }
                        ]
                      }));
                    }
                  }}
                  onRemoveAttribute={(id) => {
                    setHouseForm(prev => ({
                      ...prev,
                      attributes: prev.attributes.filter(a => a.attribute.id !== id)
                    }));
                  }}
                  onAttributeChange={(id, value) => {
                    setHouseForm(prev => ({
                      ...prev,
                      attributes: prev.attributes.map(a => 
                        a.attribute.id === id ? { ...a, value } : a
                      )
                    }));
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setIsCreateAttributeModalOpen(true)}
                >
                  + Добавить новый атрибут
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditHouseModalOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateHouse}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isHouseImageModalOpen} onOpenChange={setIsHouseImageModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Управление изображениями дома</DialogTitle>
              <DialogDescription>{currentHouse?.name}</DialogDescription>
            </DialogHeader>
            {currentHouse && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentHouse.main_image && (
                    <div className="relative group h-48">
                      <Image
                        src={`http://127.0.0.1:8000/${currentHouse.main_image}`}
                        alt="Основное изображение"
                        fill
                        className="rounded-md object-cover border-2 border-blue-500"
                        unoptimized
                        priority
                      />
                      <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge className="absolute top-2 left-2">Основное</Badge>
                      </div>
                    </div>
                  )}
                  {currentHouse.images?.filter(img => img.image !== currentHouse.main_image).map(img => (
                    <div key={img.id} className="relative group h-48">
                      <Image
                        src={
                          img.image.startsWith('http')
                            ? img.image
                            : `http://127.0.0.1:8000/${img.image}`
                        }
                        alt="Дополнительное изображение"
                        fill
                        className="rounded-md object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteHouseImage(img.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                      {currentHouse.main_image === img.image && (
                        <Badge className="absolute top-2 left-2">Основное</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleHouseImageFileChange}
                  />
                  <Button onClick={handleAddHouseImage} disabled={!houseImageFile}>Добавить</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteHouseModalOpen} onOpenChange={setIsDeleteHouseModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Подтверждение удаления</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Вы уверены, что хотите удалить дом "{currentHouse?.name}"? Это действие нельзя отменить.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteHouseModalOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleDeleteHouse}>
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateApartmentModalOpen} onOpenChange={setIsCreateApartmentModalOpen}>
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Добавить апартамент</DialogTitle>
              <DialogDescription>Дом: {currentHouse?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название</label>
                <Input
                  name="name"
                  value={apartmentForm.name}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Категория</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={apartmentForm.id_category.toString()}
                  onChange={e => setApartmentForm({ ...apartmentForm, id_category: Number(e.target.value) })}
                >
                  <option value="0">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество комнат</label>
                <Input
                  type="number"
                  name="rooms"
                  value={apartmentForm.rooms}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Площадь (м²)</label>
                <Input
                  type="number"
                  name="area"
                  value={apartmentForm.area}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество</label>
                <Input
                  type="number"
                  name="count"
                  value={apartmentForm.count}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  name="description"
                  value={apartmentForm.description}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Параметры</label>
                <ApartmentParametersManager
                  parameters={apartmentForm.parameters}
                  availableParameters={parameters}
                  onAddParameter={(id) => {
                    setApartmentForm(prev => ({
                      ...prev,
                      parameters: [...prev.parameters, { id_parameter: id, value: '' }]
                    }));
                  }}
                  onRemoveParameter={(id) => {
                    setApartmentForm(prev => ({
                      ...prev,
                      parameters: prev.parameters.filter(p => p.id_parameter !== id)
                    }));
                  }}
                  onParameterChange={(id, value) => {
                    setApartmentForm(prev => ({
                      ...prev,
                      parameters: prev.parameters.map(p => 
                        p.id_parameter === id ? { ...p, value } : p
                      )
                    }));
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateApartmentModalOpen(false)}>
                Отмена
              </Button>
              <Button type="button" onClick={handleCreateApartment}>Создать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditApartmentModalOpen} onOpenChange={setIsEditApartmentModalOpen}>
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Редактировать апартамент</DialogTitle>
              <DialogDescription>{currentApartment?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название</label>
                <Input
                  name="name"
                  value={apartmentForm.name}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Категория</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={apartmentForm.id_category.toString()}
                  onChange={e => setApartmentForm({ ...apartmentForm, id_category: Number(e.target.value) })}
                >
                  <option value="0">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество комнат</label>
                <Input
                  type="number"
                  name="rooms"
                  value={apartmentForm.rooms}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Площадь (м²)</label>
                <Input
                  type="number"
                  name="area"
                  value={apartmentForm.area}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество</label>
                <Input
                  type="number"
                  name="count"
                  value={apartmentForm.count}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  name="description"
                  value={apartmentForm.description}
                  onChange={handleApartmentInputChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Параметры</label>
                <ApartmentParametersManager
                  parameters={apartmentForm.parameters}
                  availableParameters={parameters}
                  onAddParameter={(id) => {
                    setApartmentForm(prev => ({
                      ...prev,
                      parameters: [...prev.parameters, { id_parameter: id, value: '' }]
                    }));
                  }}
                  onRemoveParameter={(id) => {
                    setApartmentForm(prev => ({
                      ...prev,
                      parameters: prev.parameters.filter(p => p.id_parameter !== id)
                    }));
                  }}
                  onParameterChange={(id, value) => {
                    setApartmentForm(prev => ({
                      ...prev,
                      parameters: prev.parameters.map(p => 
                        p.id_parameter === id ? { ...p, value } : p
                      )
                    }));
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditApartmentModalOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateApartment}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isApartmentImageModalOpen} onOpenChange={setIsApartmentImageModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Управление изображениями апартамента</DialogTitle>
              <DialogDescription>{currentApartment?.name}</DialogDescription>
            </DialogHeader>
            {currentApartment && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                  {currentApartment.main_image && (
                    <div className="relative group h-48">
                      <Image
                        src={
                          currentApartment.main_image.startsWith('http')
                            ? currentApartment.main_image
                            : `http://127.0.0.1:8000/${currentApartment.main_image}`
                        }
                        alt="Основное изображение"
                        fill
                        className="rounded-md object-cover border-2 border-blue-500"
                        unoptimized
                        priority
                      />
                      <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge className="absolute top-2 left-2">Основное</Badge>
                      </div>
                    </div>
                  )}
                  {currentApartment.images?.filter(img => img.image !== currentApartment.main_image).map(img => (
                    <div key={img.id} className="relative group h-48">
                      <Image
                        src={
                          img.image.startsWith('http')
                            ? img.image
                            : `http://127.0.0.1:8000/${img.image}`
                        }
                        alt="Дополнительное изображение"
                        fill
                        className="rounded-md object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteApartmentImage(img.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleApartmentImageFileChange}
                  />
                  <Button onClick={handleAddApartmentImage} disabled={!apartmentImageFile}>Добавить</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteApartmentModalOpen} onOpenChange={setIsDeleteApartmentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Подтверждение удаления</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Вы уверены, что хотите удалить апартамент "{currentApartment?.name}"? Это действие нельзя отменить.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteApartmentModalOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleDeleteApartment}>
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateAttributeModalOpen} onOpenChange={setIsCreateAttributeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новый атрибут дома</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={newAttributeForm.name}
                  onChange={e => setNewAttributeForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  value={newAttributeForm.description}
                  onChange={e => setNewAttributeForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateAttributeModalOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreateAttribute}>Добавить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminHousesPage;