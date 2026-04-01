import { API_BASE_URL } from '../config';

const API_URL = API_BASE_URL;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
          const { user, token } = data.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            loading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Error al iniciar sesión' 
          };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const { data } = await axios.get(`${API_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: data.data.user, isAuthenticated: true });
        } catch (error) {
          get().logout();
        }
      }
    }),
    {
      name: 'import-store-auth',
    }
  )
);

// Add axios interceptor to include token in all requests
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
