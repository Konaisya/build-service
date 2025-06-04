'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/api/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, PackageSearch, UserCog, LogOut, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from '@/components/ui/adminSidebbar';

type ProfileData = {
  id: number;
  email?: string;
  name: string;
};

const AdminPage = () => {
  const { user, isInitialized, accessToken, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (isInitialized && (!user || user.role !== 'ADMIN')) {
      router.push('/auth');
    }
  }, [isInitialized, user, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return;

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.error('Ошибка при получении профиля:', error);
      }
    };

    fetchProfile();
  }, [accessToken]);

  if (!isInitialized || !user || user.role !== 'ADMIN') return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <div className="max-w-6xl w-full">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold">
                {profile?.name ? getInitials(profile.name) : 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profile?.name || 'Администратор'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge  className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Администратор</span>
                </Badge>
                <p className="text-muted-foreground text-sm">{profile?.email || ''}</p>
              </div>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            <Button 
              variant="destructive" 
              className="gap-2 shadow-lg"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/houses">
            <motion.div 
              whileHover={{ y: -8, boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.12)" }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <Card className="h-full border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Управление домами</h2>
                  <p className="text-muted-foreground text-sm">
                    Добавляйте, редактируйте и управляйте каталогом домов
                  </p>
                  <Button variant="outline" className="mt-2 gap-2">
                    Перейти <span className="text-blue-600">→</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/admin/orders">
            <motion.div 
              whileHover={{ y: -8, boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.12)" }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <Card className="h-full border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors duration-300">
                    <PackageSearch className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Управление заказами</h2>
                  <p className="text-muted-foreground text-sm">
                    Просматривайте и управляйте всеми заказами пользователей
                  </p>
                  <Button variant="outline" className="mt-2 gap-2">
                    Перейти <span className="text-purple-600">→</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/admin/users">
            <motion.div 
              whileHover={{ y: -8, boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.12)" }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <Card className="h-full border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors duration-300">
                    <UserCog className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Управление пользователями</h2>
                  <p className="text-muted-foreground text-sm">
                    Управляйте учетными записями и правами пользователей
                  </p>
                  <Button variant="outline" className="mt-2 gap-2">
                    Перейти <span className="text-green-600">→</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>
      </div>
      <AdminSidebar />
    </motion.div>
  );
};

export default AdminPage;
