"use client"
import Sidebar from "@/components/ui/sidebar";
import { useState } from 'react';
import "@/styles/main.css";
const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    return ( 
        <>
        <div className='btnContainer'>
        <button className='sidebar-button' onClick={toggleSidebar}>
          {isSidebarOpen ? 'Скрыть меню' : 'Показать меню'}
        </button></div>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
     );
}
 
export default Header;