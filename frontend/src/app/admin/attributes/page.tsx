'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/api/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogDescription } from '@/components/ui/alert-dialog';
import AdminSidebar from '@/components/ui/adminSidebbar';

type HouseAttribute = {
  id: number;
  name: string;
  description: string;
};

type ApartmentParameter = {
  id: number;
  name: string;
};

type ApartmentCategory = {
  id: number;
  name: string;
};

export default function AdminHouseAttributesPage() {
  const { accessToken } = useAuth();
  const [tab, setTab] = useState<'house' | 'apartment' | 'category'>('house');
  const [attributes, setAttributes] = useState<HouseAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; description: string }>({ name: '', description: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [apParams, setApParams] = useState<ApartmentParameter[]>([]);
  const [apLoading, setApLoading] = useState(true);
  const [apError, setApError] = useState<string | null>(null);
  const [apForm, setApForm] = useState<{ name: string }>({ name: '' });
  const [apEditId, setApEditId] = useState<number | null>(null);
  const [apSubmitting, setApSubmitting] = useState(false);
  const [isApModalOpen, setIsApModalOpen] = useState(false);
  const [apDeleteDialog, setApDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [categories, setCategories] = useState<ApartmentCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);
  const [catForm, setCatForm] = useState<{ name: string }>({ name: '' });
  const [catEditId, setCatEditId] = useState<number | null>(null);
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catDeleteDialog, setCatDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    axios
      .get('http://127.0.0.1:8000/api/house_attributes/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(res => setAttributes(res.data))
      .catch(() => setError('Ошибка загрузки атрибутов'))
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    setApLoading(true);
    axios
      .get('http://127.0.0.1:8000/api/apartment_parameters/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(res => setApParams(res.data))
      .catch(() => setApError('Ошибка загрузки параметров'))
      .finally(() => setApLoading(false));
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    setCatLoading(true);
    axios
      .get('http://127.0.0.1:8000/api/apartment_category/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(res => setCategories(res.data))
      .catch(() => setCatError('Ошибка загрузки категорий'))
      .finally(() => setCatLoading(false));
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Название обязательно');
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        await axios.put(
          `http://127.0.0.1:8000/api/house_attributes/${editId}`,
          form,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        toast.success('Атрибут обновлен');
      } else {
        await axios.post(
          'http://127.0.0.1:8000/api/house_attributes/',
          form,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        toast.success('Атрибут создан');
      }
      setForm({ name: '', description: '' });
      setEditId(null);
      setIsCreateModalOpen(false);
      const res = await axios.get('http://127.0.0.1:8000/api/house_attributes/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAttributes(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || 'Ошибка сохранения');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (attr: HouseAttribute) => {
    setEditId(attr.id);
    setForm({ name: attr.name, description: attr.description });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/house_attributes/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAttributes(prev => prev.filter(a => a.id !== id));
      toast.success('Атрибут удален');
    } catch {
      toast.error('Ошибка удаления');
    }
    setDeleteDialog({ open: false, id: null });
  };

  const handleApSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apForm.name.trim()) {
      toast.error('Название обязательно');
      return;
    }
    setApSubmitting(true);
    try {
      if (apEditId) {
        await axios.put(
          `http://127.0.0.1:8000/api/apartment_parameters/${apEditId}`,
          apForm,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        toast.success('Параметр обновлен');
      } else {
        await axios.post(
          'http://127.0.0.1:8000/api/apartment_parameters/',
          apForm,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        toast.success('Параметр создан');
      }
      setApForm({ name: '' });
      setApEditId(null);
      setIsApModalOpen(false);
      const res = await axios.get('http://127.0.0.1:8000/api/apartment_parameters/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setApParams(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || 'Ошибка сохранения');
    } finally {
      setApSubmitting(false);
    }
  };

  const handleApEdit = (param: ApartmentParameter) => {
    setApEditId(param.id);
    setApForm({ name: param.name });
    setIsApModalOpen(true);
  };

  const handleApDelete = async (id: number) => {
    if (!accessToken) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/apartment_parameters/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setApParams(prev => prev.filter(a => a.id !== id));
      toast.success('Параметр удален');
    } catch {
      toast.error('Ошибка удаления');
    }
    setApDeleteDialog({ open: false, id: null });
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) {
      toast.error('Название обязательно');
      return;
    }
    setCatSubmitting(true);
    try {
      if (catEditId) {
        await axios.put(
          `http://127.0.0.1:8000/api/apartment_category/${catEditId}`,
          catForm,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        toast.success('Категория обновлена');
      } else {
        await axios.post(
          'http://127.0.0.1:8000/api/apartment_category/',
          catForm,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        toast.success('Категория создана');
      }
      setCatForm({ name: '' });
      setCatEditId(null);
      setIsCatModalOpen(false);
      const res = await axios.get('http://127.0.0.1:8000/api/apartment_category/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCategories(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail?.[0]?.msg || 'Ошибка сохранения');
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleCatEdit = (cat: ApartmentCategory) => {
    setCatEditId(cat.id);
    setCatForm({ name: cat.name });
    setIsCatModalOpen(true);
  };

  const handleCatDelete = async (id: number) => {
    if (!accessToken) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/apartment_category/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCategories(prev => prev.filter(a => a.id !== id));
      toast.success('Категория удалена');
    } catch {
      toast.error('Ошибка удаления');
    }
    setCatDeleteDialog({ open: false, id: null });
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Атрибуты и параметры</h1>
      <div className="flex gap-2 mb-6">
        <Button variant={tab === 'house' ? 'default' : 'outline'} onClick={() => setTab('house')}>
          Атрибуты домов
        </Button>
        <Button variant={tab === 'apartment' ? 'default' : 'outline'} onClick={() => setTab('apartment')}>
          Параметры квартир
        </Button>
        <Button variant={tab === 'category' ? 'default' : 'outline'} onClick={() => setTab('category')}>
          Категории квартир
        </Button>
      </div>
      {tab === 'house' && (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setEditId(null); setForm({ name: '', description: '' }); setIsCreateModalOpen(true); }}>
              + Добавить атрибут
            </Button>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={open => {
            setIsCreateModalOpen(open);
            if (!open) {
              setEditId(null);
              setForm({ name: '', description: '' });
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? 'Редактировать атрибут' : 'Добавить атрибут'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Название</label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Название атрибута"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Описание</label>
                  <Textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Описание (необязательно)"
                    disabled={submitting}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {editId ? 'Сохранить' : 'Добавить'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div className="bg-white rounded-xl shadow p-6">
            {loading ? (
              <div className="text-center text-gray-400 py-10">Загрузка...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : attributes.length === 0 ? (
              <div className="text-center text-gray-400 py-10">Нет атрибутов</div>
            ) : (
              <div className="space-y-4">
                {attributes.map(attr => (
                  <div key={attr.id} className="flex flex-col md:flex-row md:items-center justify-between border-b py-3 gap-2">
                    <div>
                      <div className="font-semibold">{attr.name}</div>
                      <div className="text-gray-500 text-sm">{attr.description}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(attr)}>
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteDialog({ open: true, id: attr.id })}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
             <AdminSidebar />
          </div>
          <AlertDialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog(s => ({ ...s, open }))}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить атрибут?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Атрибут будет удалён без возможности восстановления.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })}>
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
                >
                  Да, удалить
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      {tab === 'apartment' && (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setApEditId(null); setApForm({ name: '' }); setIsApModalOpen(true); }}>
              + Добавить параметр
            </Button>
          </div>
          <Dialog open={isApModalOpen} onOpenChange={open => {
            setIsApModalOpen(open);
            if (!open) {
              setApEditId(null);
              setApForm({ name: '' });
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{apEditId ? 'Редактировать параметр' : 'Добавить параметр'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleApSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Название</label>
                  <Input
                    value={apForm.name}
                    onChange={e => setApForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Название параметра"
                    disabled={apSubmitting}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsApModalOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={apSubmitting}>
                    {apEditId ? 'Сохранить' : 'Добавить'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div className="bg-white rounded-xl shadow p-6">
            {apLoading ? (
              <div className="text-center text-gray-400 py-10">Загрузка...</div>
            ) : apError ? (
              <div className="text-center text-red-500 py-10">{apError}</div>
            ) : apParams.length === 0 ? (
              <div className="text-center text-gray-400 py-10">Нет параметров</div>
            ) : (
              <div className="space-y-4">
                {apParams.map(param => (
                  <div key={param.id} className="flex flex-col md:flex-row md:items-center justify-between border-b py-3 gap-2">
                    <div>
                      <div className="font-semibold">{param.name}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button size="sm" variant="outline" onClick={() => handleApEdit(param)}>
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setApDeleteDialog({ open: true, id: param.id })}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <AlertDialog open={apDeleteDialog.open} onOpenChange={open => setApDeleteDialog(s => ({ ...s, open }))}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить параметр?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Параметр будет удалён без возможности восстановления.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline" onClick={() => setApDeleteDialog({ open: false, id: null })}>
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => apDeleteDialog.id && handleApDelete(apDeleteDialog.id)}
                >
                  Да, удалить
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      {tab === 'category' && (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setCatEditId(null); setCatForm({ name: '' }); setIsCatModalOpen(true); }}>
              + Добавить категорию
            </Button>
          </div>
          <Dialog open={isCatModalOpen} onOpenChange={open => {
            setIsCatModalOpen(open);
            if (!open) {
              setCatEditId(null);
              setCatForm({ name: '' });
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{catEditId ? 'Редактировать категорию' : 'Добавить категорию'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCatSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Название</label>
                  <Input
                    value={catForm.name}
                    onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Название категории"
                    disabled={catSubmitting}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCatModalOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={catSubmitting}>
                    {catEditId ? 'Сохранить' : 'Добавить'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div className="bg-white rounded-xl shadow p-6">
            {catLoading ? (
              <div className="text-center text-gray-400 py-10">Загрузка...</div>
            ) : catError ? (
              <div className="text-center text-red-500 py-10">{catError}</div>
            ) : categories.length === 0 ? (
              <div className="text-center text-gray-400 py-10">Нет категорий</div>
            ) : (
              <div className="space-y-4">
                {categories.map(cat => (
                  <div key={cat.id} className="flex flex-col md:flex-row md:items-center justify-between border-b py-3 gap-2">
                    <div>
                      <div className="font-semibold">{cat.name}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button size="sm" variant="outline" onClick={() => handleCatEdit(cat)}>
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setCatDeleteDialog({ open: true, id: cat.id })}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <AlertDialog open={catDeleteDialog.open} onOpenChange={open => setCatDeleteDialog(s => ({ ...s, open }))}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Категория будет удалена без возможности восстановления.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline" onClick={() => setCatDeleteDialog({ open: false, id: null })}>
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => catDeleteDialog.id && handleCatDelete(catDeleteDialog.id)}
                >
                  Да, удалить
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
