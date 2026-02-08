import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

// Posts API
export const postsAPI = {
    // Get posts with pagination support
    getAllPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),

    // Create post - handles both JSON and FormData
    createPost: async (postData) => {
        // If file is included, use FormData
        if (postData.file) {
            const formData = new FormData();
            formData.append('media', postData.file);
            if (postData.content) formData.append('content', postData.content);

            return api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        // Otherwise, use JSON
        const jsonData = {};
        if (postData.content) jsonData.content = postData.content;
        if (postData.image) jsonData.image = postData.image;

        return api.post('/posts', jsonData);
    },

    likePost: (postId) => api.put(`/posts/${postId}/like`),
    addComment: (postId, commentData) => api.post(`/posts/${postId}/comment`, commentData),
};

export default api;
