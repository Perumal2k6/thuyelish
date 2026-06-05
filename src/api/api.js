// ─────────────────────────────────────────────────────────────────────────────
//  CENTRALIZED API MODULE (AXIOS IMPLEMENTATION)
//  Single source of truth for all backend communication.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';

/**
 * Backend Host Resolution
 */
const API_URL = import.meta.env.VITE_API_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || API_URL?.replace(/\/api$/, '') || 'https://thuyel-backend.vercel.app';

export const BASE_URL = API_URL;
export { BACKEND_URL };

// Central axios instance with baseURL and withCredentials
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Request interceptor to automatically attach authorization token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle FastAPI error structure and server errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = 'An error occurred while fetching data.';
        if (error.response) {
            if (error.response.status === 503) {
                errorMessage = 'Server storage not configured. Please contact administrator.';
            } else {
                const detail = error.response.data?.detail;
                errorMessage = typeof detail === 'string' ? detail : (error.response.data?.message || error.response.statusText || errorMessage);
            }
        } else if (error.request) {
            errorMessage = 'No response received from server.';
        } else {
            errorMessage = error.message;
        }
        return Promise.reject(new Error(errorMessage));
    }
);

// ─── Image URL Helper ─────────────────────────────────────────────────────────

/**
 * Returns the image URL for display.
 *
 * Since the backend now uploads to Cloudinary and returns full public URLs,
 * this helper simply returns the URL as-is if it is already a full https:// URL.
 * Local/relative paths are NOT supported — all images must be Cloudinary URLs.
 */
export const getImageUrl = (path) => {
    if (!path) return null;
    const p = path.toString().trim();
    // Cloudinary (and any CDN) returns fully-qualified URLs — pass through directly
    if (p.startsWith('http')) return p;
    // Not a recognised URL — return null to trigger fallback placeholder
    return null;
};

// Aliases for compatibility
export const getAboutImageUrl = getImageUrl;

// ─── Core Fetchers ────────────────────────────────────────────────────────────

export const fetcher = async (url, options = {}) => {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    let requestData = options.body;
    if (typeof requestData === 'string') {
        try {
            requestData = JSON.parse(requestData);
        } catch (e) {
            // If it's not a JSON string, keep it as is
        }
    }

    const response = await api({
        url: cleanUrl,
        method: options.method || 'GET',
        data: requestData,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    return response.data;
};

export const formFetcher = async (url, options = {}) => {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;

    const response = await api({
        url: cleanUrl,
        method: options.method || 'GET',
        data: options.body, // Native FormData
        headers: options.headers,
    });

    return response.data;
};

// ─── Photo API ────────────────────────────────────────────────────────────────
// Backend uploads to Cloudinary and returns: { url: "https://..." }
// POST /api/upload/photo — upload a new photo; returns { url }
// GET  /api/upload/photos — list all uploaded photos

export const photoApi = {
    // GET /api/upload/photos — list all uploaded photos
    listAll: () => fetcher('/upload/photos'),

    // POST /api/upload/photo — upload file as 'file' field; returns { url }
    upload: (file) => {
        const fd = new FormData();
        fd.append('file', file);
        // Do NOT set Content-Type manually — let the browser set multipart boundary
        return formFetcher('/upload/photo', { method: 'POST', body: fd });
    },

    // DELETE /api/upload/photo/{filename} — delete an uploaded file
    delete: (filename) => fetcher(`/upload/photo/${filename}`, { method: 'DELETE' })
};

// ─── API Resource Bundles ─────────────────────────────────────────────────────

export const authApi = {
    login: (password) =>
        fetcher('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
        }),
};

export const heroApi = {
    getHeroData: () => fetcher('/hero'),
    createHero: (data) => {
        const fd = new FormData();
        // Append image file as 'profile_image'; backend uploads to Cloudinary
        // and returns the record with image_url
        Object.keys(data).forEach(key => {
            if (key === 'imageFile') {
                if (data[key]) fd.append('profile_image', data[key]);
            } else if (key === 'profile_image') {
                // skip — image_url is managed by the backend after Cloudinary upload
            } else {
                fd.append(key, data[key] ?? '');
            }
        });
        return formFetcher('/hero/profile', { method: 'POST', body: fd });
    },
    updateHero: (id, data) => {
        const fd = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'imageFile') {
                if (data[key]) fd.append('profile_image', data[key]);
            } else if (key === 'profile_image') {
                // skip — image_url is managed by the backend after Cloudinary upload
            } else {
                if (data[key] !== undefined) fd.append(key, data[key]);
            }
        });
        return formFetcher(`/hero/${id}/profile`, { method: 'PUT', body: fd });
    },
};

export const aboutApi = {
    getAboutData: () => fetcher('/about'),
    createAbout: (data) => {
        const fd = new FormData();
        // Append image file as 'profile_image'; backend uploads to Cloudinary
        Object.keys(data).forEach(key => {
            if (key === 'imageFile') {
                if (data[key]) fd.append('profile_image', data[key]);
            } else if (key === 'profile_image') {
                // skip — image_url is managed by the backend after Cloudinary upload
            } else {
                fd.append(key, data[key] ?? '');
            }
        });
        return formFetcher('/about/profile', { method: 'POST', body: fd });
    },
    updateAbout: (id, data) => {
        const fd = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'imageFile') {
                if (data[key]) fd.append('profile_image', data[key]);
            } else if (key === 'profile_image') {
                // skip — image_url is managed by the backend after Cloudinary upload
            } else {
                if (data[key] !== undefined) fd.append(key, data[key]);
            }
        });
        return formFetcher(`/about/${id}/profile`, { method: 'PUT', body: fd });
    },
};

export const skillsApi = {
    getAll: () => fetcher('/skills'),
    createCategory: (payload) => fetcher('/skills', { method: 'POST', body: JSON.stringify(payload) }),
    updateCategory: (id, payload) => fetcher(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteCategory: (id) => fetcher(`/skills/${id}`, { method: 'DELETE' }),
    addItem: (categoryId, { name }) => fetcher(`/skills/${categoryId}/items?name=${encodeURIComponent(name)}`, { method: 'POST' }),
    deleteItem: (catId, itemId) => {
        const finalId = itemId || catId;
        return fetcher(`/skills/items/${finalId}`, { method: 'DELETE' });
    }
};

export const experienceApi = {
    getAll: () => fetcher('/experiences'),
    create: (payload) => fetcher('/experiences', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => fetcher(`/experiences/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => fetcher(`/experiences/${id}`, { method: 'DELETE' }),
};

export const projectsApi = {
    getAll: () => fetcher('/projects'),
    getById: (id) => fetcher(`/projects/${id}`),
    // formData is a native FormData; 'image' key must be a File for new uploads.
    // Backend uploads to Cloudinary and stores the public image_url.
    create: (formData) => {
        return formFetcher('/projects/with-image', { method: 'POST', body: formData });
    },
    update: (id, formData) => {
        return formFetcher(`/projects/${id}/with-image`, { method: 'PUT', body: formData });
    },
    delete: (id) => fetcher(`/projects/${id}`, { method: 'DELETE' }),
};

export const serviceApi = {
    getAll: () => fetcher('/services'),
    getById: (id) => fetcher(`/services/${id}`),
    create: (payload) => fetcher('/services', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => fetcher(`/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => fetcher(`/services/${id}`, { method: 'DELETE' }),
};

export const contactApi = {
    getMessages: () => fetcher('/contact-messages'),
    sendMessage: (payload) => fetcher('/contact-messages', { method: 'POST', body: JSON.stringify(payload) }),
    deleteMessage: (id) => fetcher(`/contact-messages/${id}`, { method: 'DELETE' }),
    getContactInfo: () => fetcher('/contact'),
    createContactInfo: (payload) => fetcher('/contact', { method: 'POST', body: JSON.stringify(payload) }),
    updateContactInfo: (id, payload) => fetcher(`/contact/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
};

export const contactInfoApi = {
    getContact: contactApi.getContactInfo,
    createContact: contactApi.createContactInfo,
    updateContact: contactApi.updateContactInfo,
};
