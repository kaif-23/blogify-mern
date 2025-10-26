import axios from 'axios';

// This is the base URL of your backend API
const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_URL}/api`, // All requests will be prefixed with /api
    withCredentials: true, // This is crucial for sending cookies
});

// Function to get the full URL for images
export const getImageUrl = (path) => {
    if (!path) return '';
    // Check if path is already absolute (which it shouldn't be)
    if (path.startsWith('http')) return path;
    // Return the full URL by prepending the API's base URL
    return `${API_URL}${path}`;
};

export default api;