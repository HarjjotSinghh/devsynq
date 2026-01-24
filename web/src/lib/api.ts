export const API_BASE = '/api/cloud-sync';

export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('cloud_sync_key');
    }
    return null;
};

export const setAuthToken = (key: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cloud_sync_key', key);
    }
};

export const clearAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cloud_sync_key');
    }
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    } as HeadersInit;

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'API request failed');
    }
    return data;
};
