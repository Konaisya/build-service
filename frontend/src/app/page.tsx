"use client";

import "@/styles/main.css";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Slide = {
  src: string;
  title: string;
  description: string;
};

const images: Slide[] = [
  {
    src: "/house.jpg",
    title: "Строим будущее",
    description: "Надежные решения для вас.",
  },
  {
    src: "/apart.jpg",
    title: "Качество и инновации",
    description: "Мы обеспечиваем высокое качество работы и современные технологии.",
  },
  {
    src: "/homes.jpg",
    title: "Доверие и профессионализм",
    description: "Работаем с полной ответственностью и профессионализмом.",
  },
];

export default function Home() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<number>(0); 

  const setSlideInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);
  };

  useEffect(() => {
    setSlideInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSlideDotClick = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSlideInterval();
  };

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.deltaY > 0) { 
      if (infoRef.current) {
        infoRef.current.scrollIntoView({ behavior: "smooth" });
        setActiveSection(1); 
      }
    } else {
      if (headerRef.current) {
        headerRef.current.scrollIntoView({ behavior: "smooth" });
        setActiveSection(0);
      }
    }
  };

  const handleNavigationClick = (index: number) => {
    setActiveSection(index); 
    if (index === 0 && headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (index === 1 && infoRef.current) {
      infoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const imageVariants = {
    enter: { opacity: 0, x: -200 }, 
    center: { opacity: 1, x: 0 }, 
    exit: { opacity: 0, x: 200 }, 
  };

  const textVariants = {
    enter: { opacity: 0, x: 200 }, 
    center: { opacity: 1, x: 0 }, 
    exit: { opacity: 0, x: -200 }, 
  };

  return (  
    <div onWheel={handleScroll} className="all-main" style={{ overflow: "hidden" }}>
      <div
        className="main-header"
        ref={headerRef}
        style={{
          height: "100vh",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="main-header-text">
          <h1 className="main-header-h1">Строим будущее</h1>
          <h1 className="main-header-h1">Надежные решения для вас</h1>
          <p className="main-header-p">
            Наша строительная компания предлагает качественные и надежные услуги
            по возведению и ремонту жилых и коммерческих объектов.
          </p>
        </div>
      </div>


      <div
      className="info-main"
      ref={infoRef}
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
  <AnimatePresence mode="wait">
    <motion.div
      key={currentIndex}
      initial="center"
      animate="center"
      exit="center"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        position: "relative",
        flexDirection: "row", 
      }}
    >
      <motion.div
        key={images[currentIndex].title}
        initial="enter"
        animate="center"
        exit="exit"
        variants={textVariants}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          flex: 1,
          textAlign: "left",
          color: "#333",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          {images[currentIndex].title}
        </h1>
        <p style={{ fontSize: "1rem", color: "#555" }}>
          {images[currentIndex].description}
        </p>
      </motion.div>
      <motion.div
        key={images[currentIndex].src}
        initial="enter"
        animate="center"
        exit="exit"
        variants={imageVariants}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          flex: 1,
          position: "relative",
          width: "600px",
          height: "400px",
        }}
      >
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].title}
          fill
          style={{
            objectFit: "cover",
            borderRadius: "10px",
            transform: "translate(0, 0)",
          }}
          priority={currentIndex === 0}
        />
      </motion.div>
    </motion.div>

  </AnimatePresence>
  <div className="dots" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      {images.map((_, index) => (
        <span 
          key={index}
          className={`slide-dot ${currentIndex === index ? 'active' : ''}`}
          onClick={() => handleSlideDotClick(index)}  
        ></span>
      ))}
    </div>
      </div>
    
      <div
        style={{ 
          position: "fixed",
          right: "20px", 
          top: "50%", 
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column", 
          gap: "10px", 
        }}>
        <div
          onClick={() => handleNavigationClick(0)}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: activeSection === 0 ? "blue" : "gray",
            cursor: "pointer",
          }}>
        </div>
        <div
          onClick={() => handleNavigationClick(1)}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: activeSection === 1 ? "blue" : "gray",
            cursor: "pointer",
          }}></div>
      </div>
    </div>
  );
}
