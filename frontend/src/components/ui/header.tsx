'use client'
import React, { useState } from 'react';
import Link from 'next/link'; 
import '@/styles/header.css'; 

const Header: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.querySelector('.sidebar') as HTMLElement;
        const burgerButton = document.querySelector('.burger-button') as HTMLElement;

        if (sidebar && !sidebar.contains(event.target as Node) && !burgerButton?.contains(event.target as Node)) {
            closeSidebar();
        }
    };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const [accessToken, setAccessToken] = React.useState<string | null>(null);

    React.useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        setAccessToken(accessToken);
    }, []);

    return (
        <div className='all-header'>
            <div className={`burger-button ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <button className="burger-button" onClick={toggleSidebar}>
                    <span className='button-span'>Н</span>авигация
                </button>
            </div>
            <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
                <ul>
                    <li><Link href='/' className='headerLink'>Главная</Link></li>
                    <li><Link href='/services' className='headerLink'>Услуги</Link></li>
                    <li><Link href='#' className='headerLink'>О нас</Link></li>
                    {accessToken ? (
                        <li><Link href='#' className='headerLink'>Профиль</Link></li>
                    ) : (
                        <li><Link href='/auth' className='headerLink'>Войти</Link></li>
                    )}
                    
                </ul>
            </div>
        </div>
    );
};

export default Header;
