'use client';

import { useState } from "react";
import { useAuth } from "@/lib/api/AuthContext";

const inputClass = "w-full px-4 py-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
const buttonClass = "w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loading, error } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(regName, regOrg, regEmail, regPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-6 py-2 rounded font-semibold transition ${
            isLogin
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          type="button"
        >
          Вход
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-6 py-2 rounded font-semibold transition ${
            !isLogin
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          type="button"
        >
          Регистрация
        </button>
      </div>

      {isLogin ? (
        <form
          onSubmit={handleLoginSubmit}
          className="max-w-md w-full p-6 bg-white rounded-lg shadow-md"
          noValidate
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>

          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className={inputClass}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className={buttonClass}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleRegisterSubmit}
          className="max-w-md w-full p-6 bg-white rounded-lg shadow-md"
          noValidate
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>

          <input
            type="text"
            placeholder="Имя"
            className={inputClass}
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Организация"
            className={inputClass}
            value={regOrg}
            onChange={(e) => setRegOrg(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className={inputClass}
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className={buttonClass}
          >
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
      )}
    </div>
  );
}