"use client"

import "@/styles/main.css"
import Image from "next/image";
import { useRef } from "react";


export default function Home() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault(); 

    if (event.deltaY > 0) {
      // Scroll down
      if (infoRef.current) {
        infoRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll up
      if (headerRef.current) {
        headerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div onWheel={handleScroll} style={{ overflow: 'hidden' }}>
      <div className="main-header" ref={headerRef} style={{ height: "100vh", backgroundColor: '#f0f0f0' }}> 
        <div className="main-header-text">  
          <h1 className="main-header-h1">Строим будущее</h1>
          <h1 className="main-header-h1">Надежные решения для вас</h1>
          <p className="main-header-p">
            Наша строительная компания предлагает качественные и надежные услуги по возведению и ремонту жилых и коммерческих объектов.
          </p>
        </div>
      </div>
      <div className="info-main" ref={infoRef} style={{ height: "100vh", backgroundColor: '#e0e0e0' }}>
        <div className="info-main-text">
          <h1 className="info-main-text-h1">Test</h1>
          <p className="info-main-text-p">Test 2</p>
        </div>
        <div className="container-info-img">
          <div className="info-img">
            
          </div>
        </div>
      </div>
    </div>
  );
};
