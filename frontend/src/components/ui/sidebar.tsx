import React from 'react';
import '@/styles/sidebar.css';
import { receiveMessageOnPort } from 'worker_threads';
import Link  from 'next/link';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'show' : ''}`}>
            <h2>Меню</h2>
            <ul>
                <li><Link href='#'  className='headerLink  '/> gavno</li>
                <li><Link href='#'  className='headerLink  '/>  zalupa  </li>
            </ul>
        </div>
    );
};

export default Sidebar;
