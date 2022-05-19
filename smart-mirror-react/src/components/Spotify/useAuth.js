import { useEffect, useState } from 'react'
import axios from 'axios';

const useAuth = (code) => {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        if (!code) return;
        const fetchData = async () => {
            const res = await axios.post('http://localhost:3001/login', { code });
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
            // window.history.pushState({}, null, '/');
        }

        fetchData()
            .catch(() => {
                window.location = '/';
            });
    }, [code]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const interval = setInterval(() => {
            const fetchData = async () => {
                const res = await axios.post('http://localhost:3001/refresh', { refreshToken });
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
                // window.history.pushState({}, null, '/');
            }
    
            fetchData()
                .catch(() => {
                    window.location = '/';
                });
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);

    return accessToken;
}

export default useAuth;