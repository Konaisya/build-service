'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/api/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Mail, Building, ListOrdered } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';

type ProfileData = {
  id: number;
  email?: string;
  name: string;
  org_name: string;
};

type House = {
  id: number;
  name: string;
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
};


type Order = {
  id: number;
  id_user: number;
  id_house: number;
  status: string;
  contract_price: number;
  create_date: string;
  update_date: string | null;
  house?: House;
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
  const [cancelLoading, setCancelLoading] = useState<number | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);
  const [cardForm, setCardForm] = useState<{ number: string; name: string; expiry: string; cvc: string }>({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [cardErrors, setCardErrors] = useState<{ [k: string]: string }>({});
  const [payLoading, setPayLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });

useEffect(() => {
  const timer = setTimeout(() => {
    if (!accessToken) {
      router.push('/auth');
    }
  }, 200); 

  return () => clearTimeout(timer);
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
        if (err?.response?.status === 401 && accessToken && typeof window !== 'undefined') {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          if (typeof logout === 'function') logout();
        }
        setError(err.response?.data?.message || err.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleCancelOrder = async (order: Order) => {
    if (!accessToken) return;
    setCancelLoading(order.id);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${order.id}`,
        {
          status: 'CANCELLED',
          contract_price: order.contract_price ?? 0,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: 'CANCELLED' } : o
        )
      );
      setShowCancelDialog({ open: false, order: null });
    } catch (err: any) {
      if (err?.response?.status === 401 && accessToken && typeof window !== 'undefined') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        if (typeof logout === 'function') logout();
      }
    } finally {
      setCancelLoading(null);
    }
  };

  const validateCard = () => {
    const errors: { [k: string]: string } = {};
    const num = cardForm.number.replace(/\s/g, '');
    if (!/^\d{16}$/.test(num)) errors.number = 'Введите 16 цифр';
    if (!/^[A-Za-zА-Яа-яЁё\s]{5,}$/.test(cardForm.name.trim())) errors.name = 'Введите имя и фамилию';

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.expiry)) {
      errors.expiry = 'ММ/ГГ';
    } else {
      const [mm, yy] = cardForm.expiry.split('/');
      const now = new Date();
      const cardYear = 2000 + parseInt(yy, 10);
      const cardMonth = parseInt(mm, 10) - 1;
      const expiryDate = new Date(cardYear, cardMonth + 1, 0, 23, 59, 59);
      if (
        cardYear < now.getFullYear() ||
        (cardYear === now.getFullYear() && cardMonth < now.getMonth())
      ) {
        errors.expiry = 'Срок действия истёк';
      }
    }
    if (!/^\d{3}$/.test(cardForm.cvc)) errors.cvc = '3 цифры';
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = async (order: Order) => {
    if (!validateCard()) return;
    setPayLoading(true);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${order.id}`,
        {
          status: 'PAID',
          contract_price: order.contract_price ?? 0,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOrders(prev =>
        prev.map(o =>
          o.id === order.id ? { ...o, status: 'PAID' } : o
        )
      );
      setPayingOrderId(null);
      setCardForm({ number: '', name: '', expiry: '', cvc: '' });
      setCardErrors({});
    } finally {
      setPayLoading(false);
    }
  };

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
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <ListOrdered className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Заказ #{order.id}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : order.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {statusTranslations[order.status] || order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Создан</p>
                      <p className="font-medium">
                        {order.create_date 
                          ? new Date(order.create_date).toLocaleDateString('ru-RU') 
                          : 'Не указано'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <InfoCard 
                        title="Детали дома"
                        items={[
                          { label: 'Название', value: order.house?.name || 'Не указано' },
                          { label: 'Район', value: order.house?.district || 'Не указан' },
                          { label: 'Адрес', value: order.house?.address || 'Не указан' },
                        ]}
                      />
                    </div>
                    <div className="space-y-2">
                      <InfoCard 
                        title="Характеристики"
                        items={[
                          { label: 'Этажей', value: order.house?.floors || 'Не указано' },
                          { label: 'Подъездов', value: order.house?.entrances || 'Не указано' },
                          { label: 'Срок сдачи', value: order.house?.end_date 
                            ? new Date(order.house.end_date).toLocaleDateString('ru-RU') 
                            : 'Не указан' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Цена по договору</p>
                        <p className="text-xl font-bold text-blue-600">
                          {order.contract_price ? order.contract_price.toLocaleString('ru-RU') + ' ₽' : 'Не указана'}
                        </p>
                      </div>
                      {order.update_date && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Обновлен</p>
                          <p className="text-sm">
                            {new Date(order.update_date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      )}
                    </div>
                    {order.status !== 'CANCELLED' && (
                      <div className="mt-4 flex flex-col items-end gap-2">
                        {order.status === 'AWAITING_PAYMENT' ? (
                          payingOrderId === order.id ? (
                            <form
                              className="w-full max-w-xs bg-gray-50 rounded-lg p-4 border mt-2"
                              onSubmit={e => {
                                e.preventDefault();
                                handlePay(order);
                              }}
                            >
                              <div className="mb-2">
                                <label className="block text-xs font-medium mb-1">Номер карты</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={19}
                                  className={`w-full border rounded px-2 py-1 ${cardErrors.number ? 'border-red-400' : ''}`}
                                  placeholder="0000 0000 0000 0000"
                                  value={cardForm.number}
                                  onChange={e => {
                                    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                    val = val.replace(/(.{4})/g, '$1 ').trim();
                                    setCardForm(f => ({ ...f, number: val }));
                                  }}
                                />
                                {cardErrors.number && <div className="text-xs text-red-500">{cardErrors.number}</div>}
                              </div>
                              <div className="mb-2">
                                <label className="block text-xs font-medium mb-1">Имя на карте</label>
                                <input
                                  type="text"
                                  className={`w-full border rounded px-2 py-1 ${cardErrors.name ? 'border-red-400' : ''}`}
                                  placeholder="IVAN IVANOV"
                                  value={cardForm.name}
                                  onChange={e => setCardForm(f => ({ ...f, name: e.target.value.toUpperCase() }))}
                                />
                                {cardErrors.name && <div className="text-xs text-red-500">{cardErrors.name}</div>}
                              </div>
                              <div className="flex gap-2 mb-2">
                                <div className="flex-1">
                                  <label className="block text-xs font-medium mb-1">Срок</label>
                                  <input
                                    type="text"
                                    className={`w-full border rounded px-2 py-1 ${cardErrors.expiry ? 'border-red-400' : ''}`}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={cardForm.expiry}
                                    onChange={e => {
                                      let val = e.target.value.replace(/\D/g, '');
                                      if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                      setCardForm(f => ({ ...f, expiry: val }));
                                    }}
                                  />
                                  {cardErrors.expiry && <div className="text-xs text-red-500">{cardErrors.expiry}</div>}
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs font-medium mb-1">CVC</label>
                                  <input
                                    type="password"
                                    inputMode="numeric"
                                    className={`w-full border rounded px-2 py-1 ${cardErrors.cvc ? 'border-red-400' : ''}`}
                                    placeholder="123"
                                    maxLength={3}
                                    value={cardForm.cvc}
                                    onChange={e => setCardForm(f => ({ ...f, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                                  />
                                  {cardErrors.cvc && <div className="text-xs text-red-500">{cardErrors.cvc}</div>}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  type="submit"
                                  className="flex-1"
                                  disabled={payLoading}
                                >
                                  {payLoading ? 'Оплата...' : 'Оплатить'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => {
                                    setPayingOrderId(null);
                                    setCardForm({ number: '', name: '', expiry: '', cvc: '' });
                                    setCardErrors({});
                                  }}
                                  disabled={payLoading}
                                >
                                  Отмена
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => setPayingOrderId(order.id)}
                            >
                              Оплатить
                            </Button>
                          )
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={cancelLoading === order.id}
                            onClick={() => setShowCancelDialog({ open: true, order })}
                          >
                            {cancelLoading === order.id ? 'Отмена...' : 'Отменить заказ'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            <AlertDialog open={showCancelDialog.open} onOpenChange={(open: boolean) => setShowCancelDialog(s => ({ ...s, open }))}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы действительно хотите отменить заказ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Заказ будет отменён без возможности восстановления.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog({ open: false, order: null })}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => showCancelDialog.order && handleCancelOrder(showCancelDialog.order)}
                  >
                    Да, отменить
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

interface InfoItem {
  label: string;
  value: string | number;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
}

const InfoCard = ({ title, items }: InfoCardProps) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span className="text-gray-500">{item.label}:</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);