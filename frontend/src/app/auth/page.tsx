"use client"
import "./style.css"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)

    const toggleAuthMode = () => {
        setIsLogin(!isLogin)
    }

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
                            <div className="auth-input">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" />
                            </div>
                            <div className="auth-input">
                                <Label htmlFor="password">Пароль</Label>
                                <Input id="password" type="password" />
                            </div>
                            <Button className="auth-button">Войти</Button>
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
                            <div className="auth-input">
                                <Label htmlFor="fio">ФИО</Label>
                                <Input id="fio" type="text" />
                            </div>
                            <div className="auth-input">
                                <Label htmlFor="organization">Организация</Label>
                                <Input id="organization" type="text" />
                            </div>
                            <div className="auth-input">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" />
                            </div>
                            <div className="auth-input">
                                <Label htmlFor="password">Пароль</Label>
                                <Input id="password" type="password" />
                            </div>
                            <Button className="auth-button">Зарегистрироваться</Button>
                            <Button onClick={toggleAuthMode} className="auth-button">Уже есть аккаунт?</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Auth