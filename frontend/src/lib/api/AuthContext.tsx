'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    orgName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Ошибка парсинга JWT', e);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.sub && decoded.role) {
        setUser({ email: decoded.sub, role: decoded.role });
        setAccessToken(token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const formBody = `email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      const res = await axios.post(
        'http://127.0.0.1:8000/api/auth/login',
        formBody,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (res.data && res.data.access_token) {
        const token = res.data.access_token;
        const decoded = parseJwt(token);

        if (decoded && decoded.sub && decoded.role) {
          setUser({ email: decoded.sub, role: decoded.role });
          setAccessToken(token);
          localStorage.setItem('accessToken', token);
          if (decoded.role === 'USER') {
            router.push('/profile');
          } else if (decoded.role === 'ADMIN') {
            router.push('/admin');
          }
        } else {
          throw new Error('Неверный формат токена');
        }
      } else {
        throw new Error('Неверный ответ сервера');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail?.[0]?.msg || err.message || 'Ошибка входа'
      );
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    orgName: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/auth/signup',
        {
          name,
          org_name: orgName,
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      await login(email, password);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Ошибка регистрации'
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    router.push('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        signup,
        logout,
        loading,
        error,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
