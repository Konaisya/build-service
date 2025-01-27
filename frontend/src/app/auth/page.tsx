"use client"
import "./style.css"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/router"
import axios from "axios"

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("") 
    const [password, setPassword] = useState("")
    const [orgName, setOrgName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const toggleAuthMode = () => {
        setIsLogin(!isLogin)
        setErrorMessage("") 
    }
    const handleLogin = async () => {
        if (!email || !password) {
            console.error("Пожалуйста, заполните все поля.");
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await axios.post(
                'http://localhost:8000/api/auth/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', 
                    },
                }
            );
            localStorage.setItem('access_token', response.data.access_token);
            console.log("Успешный вход!");
            router.push('/profile');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Ошибка при входе:', error.response?.data || error.message);
            } else {
                console.error('Непредвиденная ошибка:', error);
            }
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const response = await axios.post<{ access_token: string }>(
                'http://localhost:8000/api/auth/signup',
                {
                    name,
                    email,
                    password,
                    org_name: orgName,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            localStorage.setItem('access_token', response.data.access_token);
            console.log("Успешная регистрация!");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(
                    error.response.data?.detail || "Ошибка при регистрации. Проверьте данные и попробуйте снова."
                );
            } else {
                setErrorMessage("Непредвиденная ошибка. Попробуйте снова.");
            }
            console.error("Ошибка при регистрации:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="all-auth" style={{ position: 'relative'}}>
            <AnimatePresence>
                {isLogin ? (
                    <motion.div 
                        key="login"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="auth-container"
                        style={{ position: 'absolute', width: '100%' }}
                    >
                        <div className="auth-header">
                            <h1 className="auth-header-title">Авторизация</h1>
                        </div>
                        <div className="auth-content">
                            {errorMessage && <p className="auth-error">{errorMessage}</p>}
                            <div className="auth-input">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="auth-input">
                                <Label htmlFor="password">Пароль</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleLogin} className="auth-button" disabled={loading}>
                                {loading ? "Вход..." : "Войти"}
                            </Button>
                            <Button onClick={toggleAuthMode} className="auth-button">Нет аккаунта?</Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="auth-container"
                        style={{ position: 'absolute', width: '100%' }}
                    >
                        <div className="auth-header">
                            <h1 className="auth-header-title">Регистрация</h1>
                        </div>
                        <div className="auth-content">
                            {errorMessage && <p className="auth-error">{errorMessage}</p>}
                            <div className="auth-input">
                                <Label htmlFor="name">Имя</Label>
                                <Input 
                                    id="name" 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="auth-input">
                                <Label htmlFor="organization">Организация</Label>
                                <Input 
                                    id="organization" 
                                    type="text" 
                                    value={orgName} 
                                    onChange={(e) => setOrgName(e.target.value)}
                                />
                            </div>
                            <div className="auth-input">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="auth-input">
                                <Label htmlFor="password">Пароль</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleRegister} className="auth-button" disabled={loading}>
                                {loading ? "Регистрация..." : "Зарегистрироваться"}
                            </Button>
                            <Button onClick={toggleAuthMode} className="auth-button">Уже есть аккаунт?</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Auth
