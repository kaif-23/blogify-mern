import { createContext, useState, useEffect, useContext } from 'react';
import api, { getImageUrl } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to add full image URL to user object
    const processUser = (userData) => {
        if (userData && userData.profileImageURL) {
            userData.profileImageURL = getImageUrl(userData.profileImageURL);
        }
        return userData;
    };

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get('/user/me');
                setUser(processUser(res.data));
            } catch (error) {
                setUser(null);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const signin = async (email, password) => {
        const res = await api.post('/user/signin', { email, password });
        setUser(processUser(res.data));
        return res.data;
    };

    const signup = async (fullName, email, password) => {
        const res = await api.post('/user/signup', { fullName, email, password });
        return res.data;
    };

    const logout = async () => {
        await api.get('/user/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signin, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};