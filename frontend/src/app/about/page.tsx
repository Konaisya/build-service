'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-4xl bg-white rounded-2xl shadow-2xl p-12 md:p-16"
      >
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-5xl font-extrabold text-indigo-700 mb-8 text-center select-none tracking-tight"
        >
          О нас
        </motion.h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
          className="space-y-8 text-gray-700 text-lg leading-relaxed"
        >
          {[
            'Мы — команда творческих и увлечённых профессионалов, стремящихся создавать лучшие цифровые продукты.',
            'Наша цель — не просто разработка, а создание удобных и надёжных решений, которые помогут вам достигать целей.',
            'Мы верим в инновации, честность и постоянное совершенствование.',
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              whileHover={{ scale: 1.03, color: '#4F46E5' }} // hover немного масштаб и цвет
              className="cursor-default select-text"
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
