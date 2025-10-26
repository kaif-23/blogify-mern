import { createContext, useState, useEffect, useContext } from 'react';
import api, { getImageUrl } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading as true

    // Helper to add full image URL to user object
    const processUser = (userData) => {
        if (userData && userData.profileImageURL) {
            // Use the helper function to construct the full URL
            userData.profileImageURL = getImageUrl(userData.profileImageURL); //
        }
        return userData;
    };

    useEffect(() => {
        console.log("AuthProvider: Checking for existing user session..."); // Keep initial log
        const checkUser = async () => {
            try {
                const res = await api.get('/user/me'); //
                console.log("AuthProvider: User found", res.data); // Keep success log
                setUser(processUser(res.data));
            } catch (error) {
                console.log("AuthProvider: No active user session found."); // Keep error log
                setUser(null); // Ensure user is null if check fails
            } finally {
                setLoading(false); // Set loading to false only after the check is done
            }
        };
        checkUser();
    }, []); // Empty dependency array ensures this runs only once on mount

    const signin = async (email, password) => {
        const res = await api.post('/user/signin', { email, password }); //
        setUser(processUser(res.data)); //
        return res.data;
    };

    const signup = async (fullName, email, password) => {
        const res = await api.post('/user/signup', { fullName, email, password }); //
        // Note: Signup doesn't log the user in automatically here.
        return res.data;
    };

    const logout = async () => {
        await api.get('/user/logout'); //
        setUser(null); //
    };

    return (
        <AuthContext.Provider value={{ user, loading, signin, signup, logout }}>
            {/* Render children only when the initial loading is complete */}
            {!loading ? children : <p className="text-center mt-5">Loading...</p>}
        </AuthContext.Provider>
    );
};