import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RequestToAPI } from '../consts';
import Loading from '../pages/Loading';

const fetchIsLogged = async () => {
    try {
        return await RequestToAPI<void>(
            "isLogged",
            "GET"
        );
    } catch (e) {
        console.error(`fetchIsLogged Error: ${e instanceof Error ? e.message : e}`);
        return null;
    }
}

const LoginRequired = () => {
    const [isLogged, setIsLogged] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const response = await fetchIsLogged();
            console.log(response);
            setIsLogged(response?.success ?? false);
        };
        checkAuth();
    }, []);

    if (isLogged === null) {
        return <Loading />;
    }

    return isLogged ? <Outlet /> : <Navigate to="/login" replace />;
}

export default LoginRequired;