'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/api/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Mail, Building, ListOrdered } from 'lucide-react';

type ProfileData = {
  id: number;
  email?: string;
  name: string;
  org_name: string;
};

type Order = {
  id: number;
  id_user: number;
  id_house: number;
  status: string;
  contract_price: number;
  create_date: string;
  update_date: string;
  house_details?: {
    address: string;
  };
};

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 50%)`;
}

const statusTranslations: Record<string, string> = {
  PENDING: 'В ожидании',
  APPROVED: 'Подтвержден',
  IN_PROGRESS: 'В процессе',
  AWAITING_PAYMENT: 'Ожидает оплаты',
  PAID: 'Оплачен',
  AWAITING_SIGN_OFF: 'Ожидает подписания',
  SIGNED: 'Подписан',
  COMPLETED: 'Завершен',
  CANCELLED: 'Отменен',
};

const Profile = () => {
  const { accessToken, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.push('/auth'); 
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileRes = await axios.get('http://127.0.0.1:8000/api/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProfile(profileRes.data);
        const ordersRes = await axios.get('http://127.0.0.1:8000/api/orders/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            id_user: profileRes.data.id
          }
        });
        setOrders(ordersRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-lg">Загрузка данных...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        Ошибка: {error}
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Профиль не найден
      </div>
    );

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-extrabold mb-6 select-none"
          style={{ backgroundColor: stringToColor(profile.name) }}
          aria-label="User avatar"
        >
          {initials}
        </div>

        <h1 className="text-3xl font-semibold mb-1 text-center">{profile.name}</h1>
        <p className="text-gray-500 mb-8 text-center">{profile.org_name}</p>

        <div className="flex w-full border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            Профиль
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('orders')}
          >
            Заказы
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="w-full space-y-6">
            <InfoRow icon={<Mail className="text-gray-600" size={20} />} label="Email" value={profile.email ?? 'Не указан'} />
            <InfoRow icon={<Building className="text-gray-600" size={20} />} label="Организация" value={profile.org_name} />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="w-full space-y-4">
            {orders.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                У вас пока нет заказов
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <ListOrdered className="text-gray-600" size={18} />
                    <h3 className="font-medium">Заказ #{order.id}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Статус:</span>
                      <span className="ml-2">{statusTranslations[order.status] || order.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Цена:</span>
                      <span className="ml-2">{order.contract_price.toLocaleString()} ₽</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Создан:</span>
                      <span className="ml-2">{new Date(order.create_date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Обновлен:</span>
                      <span className="ml-2">{new Date(order.update_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {order.house_details && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Адрес:</span>
                      <span className="ml-2">{order.house_details.address}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <Button
          variant="destructive"
          className="mt-10 w-full"
          onClick={logout}
          aria-label="Выйти из аккаунта"
        >
          Выйти из аккаунта
        </Button>
      </div>
    </motion.div>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-center space-x-4">
    {icon}
    <div>
      <p className="text-gray-700 font-medium">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

export default Profile;