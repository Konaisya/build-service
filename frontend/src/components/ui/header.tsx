"use client";
import { useState } from 'react';
import "@/styles/header.css";
import Link from 'next/link';

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='all-header'>
            <div className={`burger-button ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <button className="burger-button" onClick={toggleSidebar}><span className='button-span'>Н</span>авигация</button>
            </div>
            <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
                <ul>
                    <li><Link href='/' className='headerLink'>Главная</Link></li>
                    <li><Link href='/services' className='headerLink'>Услуги</Link></li>
                    <li><Link href='#' className='headerLink'>О нас</Link></li>
                    <li><Link href='#' className='headerLink'>Профиль</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Header;