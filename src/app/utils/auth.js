// Funcții helper pentru autentificare

const API_URL = 'http://localhost:3001';

export const authAPI = {
  // Login
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  // Register
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  // Get Profile
  async getProfile() {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  },

  // Verifică dacă utilizatorul este autentificat
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  // Obține token-ul curent
  getToken() {
    return localStorage.getItem('access_token');
  },

  // Obține utilizatorul curent
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }
};

// Interceptor pentru request-uri API
export async function authenticatedFetch(url, options = {}) {
  const token = authAPI.getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Dacă primim 401, redirecționează la login
  if (response.status === 401) {
    authAPI.logout();
    return;
  }

  return response;
}