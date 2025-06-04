'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, PackageSearch, UserCog, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/admin/houses', icon: <Building2 className="w-6 h-6" />, label: 'Дома' },
  { href: '/admin/orders', icon: <PackageSearch className="w-6 h-6" />, label: 'Заказы' },
  { href: '/admin/users', icon: <UserCog className="w-6 h-6" />, label: 'Пользователи' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 right-0 h-full w-20 bg-white border-l border-gray-200 shadow-lg flex flex-col items-center py-8">
      <div className="mb-12 flex flex-col items-center space-y-2">
        <Shield className="w-8 h-8 text-blue-600" />
        <span className="text-xs font-semibold text-blue-600 select-none">Admin</span>
      </div>

      <ul className="flex flex-col gap-6 w-full">
        {navItems.map(({ href, icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <li key={href} className="relative group">
              <Link
                href={href}
                className={`
                  flex flex-col items-center justify-center w-full h-14
                  text-gray-600 hover:text-blue-600 transition-colors
                  ${isActive ? 'text-blue-600' : ''}
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {icon}
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute right-full mr-3 whitespace-nowrap
                             bg-blue-600 text-white text-xs font-semibold
                             rounded px-2 py-1 pointer-events-none
                             select-none"
                >
                  {label}
                </motion.span>
              </Link>
              {isActive && (
                <span className="absolute top-0 right-0 h-14 w-1 rounded-l-full bg-blue-600" />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
