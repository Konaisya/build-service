"use client"

import "@/styles/main.css"
import Image from "next/image"



export default function Home() {
  return (
    <div className="main-header">
      <div className="main-header-text">
        <h1 className="main-header-h1"> Строим будущее</h1>
        <h1 className="main-header-h1">Надежные решения для вас</h1>
        <p className="main-header-p">Наша строительная компания предлагает качественные и надежные услуги по возведению и ремонту жилых и коммерческих объектов.</p>
      </div>
      <Image className="main-header-img" width={50} height={50} src={"/homes.jpg"}  alt="" />
    </div>
  );
}
