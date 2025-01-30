import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginResponse, login } from '@/api/auth';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const data:LoginResponse = await login(email, password);
            setToken(data.access_token);
            router.push('/profile');
            
        } catch (error) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };
        return { handleLogin, loading, error, token };
};