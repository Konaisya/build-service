'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import '@/styles/header.css'; 
function parseJwt(token: string): { role?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const updateAccessToken = () => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);

    if (token) {
      const decoded = parseJwt(token);
      setRole(decoded?.role ?? null);
    } else {
      setRole(null);
    }
  };

  useEffect(() => {
    updateAccessToken();
    window.addEventListener('storage', updateAccessToken);
    return () => {
      window.removeEventListener('storage', updateAccessToken);
    };
  }, []);

  useEffect(() => {
    console.log('Token:', accessToken);
    console.log('Role:', role);
  }, [accessToken, role]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="all-header">
      <div className={`burger-button ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="burger-button" onClick={toggleSidebar}>
          <span className="button-span">Н</span>авигация
        </button>
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
        <ul>
          <li><Link href="/" className="headerLink">Главная</Link></li>
          <li><Link href="/services" className="headerLink">Услуги</Link></li>
          <li><Link href="/about" className="headerLink">О нас</Link></li>

          {accessToken && role === 'ADMIN' && (
            <li><Link href="/admin" className="headerLink">Админ панель</Link></li>
          )}

          {accessToken && role === 'USER' && (
            <li><Link href="/profile" className="headerLink">Профиль</Link></li>
          )}

          {!accessToken && (
            <li><Link href="/auth" className="headerLink">Войти</Link></li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
