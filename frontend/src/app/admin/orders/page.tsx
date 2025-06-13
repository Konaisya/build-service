'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/api/AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AdminSidebar from '@/components/ui/adminSidebbar';

const statusOptions = [
	{ value: '', label: 'Все статусы' },
	{ value: 'PENDING', label: 'В ожидании' },
	{ value: 'APPROVED', label: 'Подтвержден' },
	{ value: 'IN_PROGRESS', label: 'В процессе' },
	{ value: 'AWAITING_PAYMENT', label: 'Ожидает оплаты' },
	{ value: 'PAID', label: 'Оплачен' },
	{ value: 'AWAITING_SIGN_OFF', label: 'Ожидает подписания' },
	{ value: 'SIGNED', label: 'Подписан' },
	{ value: 'COMPLETED', label: 'Завершен' },
	{ value: 'CANCELLED', label: 'Отменен' },
	{ value: 'SOLD', label: 'Продан' },
];

const statusColor = (status: string) => {
	switch (status) {
		case 'PENDING':
			return 'bg-yellow-100 text-yellow-800';
		case 'APPROVED':
			return 'bg-green-100 text-green-800';
		case 'IN_PROGRESS':
			return 'bg-blue-100 text-blue-800';
		case 'AWAITING_PAYMENT':
			return 'bg-orange-100 text-orange-800';
		case 'PAID':
			return 'bg-green-100 text-green-800';
		case 'AWAITING_SIGN_OFF':
			return 'bg-purple-100 text-purple-800';
		case 'SIGNED':
			return 'bg-indigo-100 text-indigo-800';
		case 'COMPLETED':
			return 'bg-gray-200 text-gray-800';
		case 'CANCELLED':
			return 'bg-red-100 text-red-800';
		case 'SOLD':
			return 'bg-pink-100 text-pink-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
};

export default function AdminOrdersPage() {
	const { accessToken, user, isInitialized } = useAuth();
	const router = useRouter();
	const [orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState('');
	const [search, setSearch] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [updatingId, setUpdatingId] = useState<number | null>(null);
	const [priceEdit, setPriceEdit] = useState<{ [id: number]: string }>({});

	useEffect(() => {
		if (isInitialized && (!user || user.role !== 'ADMIN')) {
			router.push('/auth');
		}
	}, [isInitialized, user, router]);

	useEffect(() => {
		if (!accessToken) return;
		setLoading(true);
		axios
			.get('http://127.0.0.1:8000/api/orders/', {
				headers: { Authorization: `Bearer ${accessToken}` },
			})
			.then((res) => setOrders(res.data))
			.catch((err) => setError('Ошибка загрузки заказов'))
			.finally(() => setLoading(false));
	}, [accessToken]);

	const handleStatusChange = async (order: any, newStatus: string) => {
		if (!accessToken) return;
		setUpdatingId(order.id);
		try {
			let contract_price = order.contract_price ?? 0;

			if (newStatus === 'APPROVED' && priceEdit[order.id] !== undefined) {
				const parsed = parseFloat(priceEdit[order.id].replace(/\s/g, '').replace(',', '.'));
				if (isNaN(parsed) || parsed <= 0) {
					toast.error('Введите корректную цену для подтверждения заказа');
					setUpdatingId(null);
					return;
				}
				contract_price = parsed;
			}
			await axios.put(
				`http://127.0.0.1:8000/api/orders/${order.id}`,
				{
					status: newStatus,
					contract_price,
				},
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
			setOrders((prev) =>
				prev.map((o) =>
					o.id === order.id
						? { ...o, status: newStatus, contract_price }
						: o
				)
			);
			toast.success('Статус заказа успешно обновлен');
		} catch (err: any) {
			const msg =
				err?.response?.data?.message ||
				err?.response?.data?.detail ||
				err?.message ||
				'Ошибка при обновлении заказа';
			toast.error(msg);
		} finally {
			setUpdatingId(null);
		}
	};

	const filteredOrders = orders.filter((order) => {
		const user = order.user?.name?.toLowerCase() || '';
		const house = order.house?.name?.toLowerCase() || '';
		const searchLower = search.toLowerCase();
		const matchesSearch = user.includes(searchLower) || house.includes(searchLower);
		const matchesStatus = statusFilter ? order.status === statusFilter : true;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-5xl font-black mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-400 to-indigo-500 tracking-tight drop-shadow-lg select-none">
					Управление заказами
				</h1>
				<div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
					<div className="flex gap-3 w-full md:w-auto">
						<Input
							placeholder="Поиск по пользователю или дому"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="max-w-xs rounded-xl border-0 shadow-md focus:ring-2 focus:ring-blue-300 bg-white/80 backdrop-blur"
						/>
						<select
							className="rounded-xl px-4 py-2 bg-white/80 shadow-md border-0 focus:ring-2 focus:ring-blue-300"
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
						>
							{statusOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
						<Button
							variant="outline"
							className="rounded-xl border-blue-200 shadow-md hover:bg-blue-50"
							onClick={() => {
								setSearch('');
								setStatusFilter('');
							}}
						>
							Сбросить фильтры
						</Button>
					</div>
				</div>
				<div className="rounded-3xl shadow-2xl bg-white/90 p-8 border border-blue-100 backdrop-blur-lg">
					{loading ? (
						<div className="text-center py-24 text-blue-400 text-xl font-semibold animate-pulse">
							Загрузка...
						</div>
					) : error ? (
						<div className="text-center py-24 text-red-500 text-xl font-semibold">
							{error}
						</div>
					) : filteredOrders.length === 0 ? (
						<div className="text-center py-16 text-gray-400 text-xl font-medium">
							Нет заказов
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{filteredOrders.map((order) => (
								<div
									key={order.id}
									className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-4 hover:shadow-2xl transition"
									style={{
										boxShadow: '0 4px 24px 0 rgba(30,64,175,0.07)',
									}}
								>
									<div className="flex items-center justify-between">
										<div className="flex flex-col">
											<span className="text-xs text-gray-400">ID заказа</span>
											<span className="font-extrabold text-blue-700 text-lg">{order.id}</span>
										</div>
										<span
											className={`px-4 py-1 rounded-full text-xs font-bold border ${statusColor(
												order.status
											)} border-blue-200 shadow-sm uppercase tracking-wide`}
										>
											{statusOptions.find((s) => s.value === order.status)?.label || order.status}
										</span>
									</div>
									<div>
										<div className="text-sm text-gray-500">Пользователь</div>
										<div className="font-medium">{order.user?.name}</div>
									</div>
									<div>
										<div className="text-sm text-gray-500">Организация</div>
										<div>{order.user?.org_name}</div>
									</div>
									<div>
										<div className="text-sm text-gray-500">Email</div>
										<div>{order.user?.email}</div>
									</div>
									<div>
										<div className="text-sm text-gray-500">Дом</div>
										<div className="font-medium">{order.house?.name}</div>
									</div>
									<div>
										<div className="text-sm text-gray-500">Цена</div>
										{order.status === 'APPROVED' ? (
											<div className="flex items-center gap-2">
												<input
													type="text"
													className="border rounded px-2 py-1 w-32 text-right font-semibold focus:ring-2 focus:ring-blue-300"
													value={
														priceEdit[order.id] !== undefined
															? priceEdit[order.id]
															: order.contract_price?.toLocaleString('ru-RU') ?? ''
													}
													onChange={e =>
														setPriceEdit(prev => ({
															...prev,
															[order.id]: e.target.value.replace(/[^\d.,\s]/g, ''),
														}))
													}
													placeholder="Цена"
													disabled={updatingId === order.id}
												/>
												<span className="text-gray-500">₽</span>
												<Button
													size="sm"
													variant="outline"
													disabled={updatingId === order.id}
													onClick={() => handleStatusChange(order, 'APPROVED')}
												>
													Сохранить
												</Button>
											</div>
										) : (
											<div className="font-semibold">{order.contract_price?.toLocaleString('ru-RU') ?? '—'}</div>
										)}
									</div>
									<div className="flex gap-4">
										<div>
											<div className="text-xs text-gray-400">Создан</div>
											<div>{order.create_date ? new Date(order.create_date).toLocaleDateString('ru-RU') : '—'}</div>
										</div>
										<div>
											<div className="text-xs text-gray-400">Обновлен</div>
											<div>{order.update_date ? new Date(order.update_date).toLocaleDateString('ru-RU') : '—'}</div>
										</div>
									</div>
									<div>
										<label className="block text-xs text-gray-500 mb-1">Изменить статус</label>
										<select
											className="border-0 rounded-lg px-2 py-2 text-xs bg-blue-50 hover:bg-blue-100 transition font-semibold shadow focus:ring-2 focus:ring-blue-300"
											value={order.status}
											disabled={updatingId === order.id}
											onChange={(e) => handleStatusChange(order, e.target.value)}
										>
											<option value={order.status} disabled>
												{statusOptions.find((s) => s.value === order.status)?.label || order.status}
											</option>
											{statusOptions
												.filter((opt) => opt.value && opt.value !== order.status)
												.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.label}
													</option>
												))}
										</select>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
            <AdminSidebar />
		</div>
	);
}
