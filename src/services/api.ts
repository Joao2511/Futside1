import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use localhost por causa do 'adb reverse'
const BASE_URL = 'https://futside-back.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para adicionar o token de autenticação a todas as requisições
apiClient.interceptors.request.use(
  async (config) => {
    if (!config.headers.Authorization) {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- TIPOS DE DADOS E PAYLOADS ---
export interface ScoreUpdatePayload { score_a: number; score_b: number; }
export interface HourDetail {
  day: string;
  time: string;
}

export interface FieldCreatePayload {
  name: string;
  address: string;
  city: string;
  state: string;
  title?: string;
  description?: string;
  price?: string;
  phone?: string;
  email?: string;
  images?: string[];
  hours?: HourDetail[];
  latitude?: number;
  longitude?: number;
}

// Interface para a resposta da API de Quadra
export interface FieldResponse extends FieldCreatePayload {
  id: number;
  locador_id: number;
  rating?: number;
  reviews?: number;
}

// Autenticação
export interface AuthToken { access_token: string; token_type: string; }
export interface UserCreatePayload { name: string; email: string; password: string; phone?: string; city?: string; }

// Respostas de Utilizador
export interface UserResponse { id: number; name: string; email: string; }
export interface PlayerProfileResponse extends PlayerProfilePayload { user_id: number; }
export interface PublicProfileResponse extends UserResponse { player_profile: PlayerProfileResponse | null; }

// Quadras
export interface FieldCreatePayload { name: string; address: string; city: string; state: string; latitude?: number; longitude?: number; }
export interface FieldResponse extends FieldCreatePayload { id: number; locador_id: number; }
export interface FieldNestedResponse { name: string; city: string; }

// Partidas
export interface MatchCreatePayload { field_id: number; title: string; date: string; start_time: string; end_time: string; max_players: number; }
export interface PlayerInMatch extends UserResponse {}
export interface MatchResponse extends MatchCreatePayload { id: number; creator_id: number; status: string; player_count: number; field: FieldNestedResponse; }
export interface MatchDetailResponse extends MatchResponse {
    players: PlayerInMatch[];
    score_a: number;
    score_b: number;
}

// Perfis
export interface PlayerProfilePayload { position: string; skill_level: 'beginner' | 'intermediate' | 'advanced' | 'professional'; }

// --- FUNÇÕES DE SERVIÇO ---

// -- Autenticação --
export const login = async (email: string, password: string): Promise<AuthToken> => {
    // Send JSON data instead of form-encoded data
    const response = await apiClient.post('/auth/token', {
        email: email,  // Use 'email' to match your UserLogin schema
        password: password
    });
    
    if (response.data.access_token) {
        const token = response.data.access_token;
        await AsyncStorage.setItem('user_token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return response.data;
};

export const logout = async () => {
    await AsyncStorage.removeItem('user_token');
    delete apiClient.defaults.headers.common['Authorization'];
};

export const startMatch = async (matchId: number): Promise<any> => {
    const response = await apiClient.post(`/matches/${matchId}/start`);
    return response.data;
};

export const updateScore = async (matchId: number, scoreData: ScoreUpdatePayload): Promise<void> => {
    await apiClient.put(`/matches/${matchId}/score`, scoreData);
};

// -- Utilizadores & Perfis --
export const createUser = async (userData: UserCreatePayload): Promise<AuthToken> => {
    const response = await apiClient.post('/users/', userData);
    if (response.data.access_token) {
        const token = response.data.access_token;
        await AsyncStorage.setItem('user_token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return response.data;
};

export const getMyProfile = async (): Promise<PublicProfileResponse> => {
    const response = await apiClient.get('/users/me');
    return response.data;
};

export const getUserProfile = async (userId: number): Promise<PublicProfileResponse> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
};

export const updatePlayerProfile = async (profileData: PlayerProfilePayload): Promise<PlayerProfileResponse> => {
    const response = await apiClient.put('/users/me/player-profile', profileData);
    return response.data;
};

// -- Quadras & Feed --
export const getFieldsFeed = async (city?: string): Promise<FieldResponse[]> => {
    const response = await apiClient.get('/fields/feed', { params: city ? { city } : {} });
    return response.data;
};

export const getFieldDetails = async (fieldId: number): Promise<FieldResponse> => {
    const response = await apiClient.get(`/fields/${fieldId}`);
    return response.data;
};

export const getMyFields = async (): Promise<FieldResponse[]> => {
    const response = await apiClient.get('/fields/me');
    return response.data;
};

// FUNÇÃO NOVA 1: Para cancelar a inscrição
export const unsubscribeFromRegion = async (city: string) => {
    const response = await apiClient.delete(`/users/me/subscriptions/region/${city}`);
    return response.data;
};

// FUNÇÃO NOVA 2: Para buscar as inscrições do usuário
export const getMySubscriptions = async (): Promise<string[]> => {
    const response = await apiClient.get('/users/me/subscriptions');
    // A API retorna um objeto { subscribed_cities: [...] }, então pegamos o array
    return response.data.subscribed_cities;
};

export const createField = async (fieldData: FieldCreatePayload): Promise<FieldResponse> => {
    const response = await apiClient.post('/fields/', fieldData);
    return response.data;
};

// -- Partidas & Feed --
export const getMatchesFeed = async (city?: string): Promise<MatchResponse[]> => {
    const response = await apiClient.get('/matches/feed', { params: city ? { city } : {} });
    return response.data;
};

export const getMatchDetails = async (matchId: number): Promise<MatchDetailResponse> => {
    const response = await apiClient.get(`/matches/${matchId}`);
    return response.data;
};

export const createMatch = async (matchData: MatchCreatePayload): Promise<MatchResponse> => {
    const response = await apiClient.post('/matches/', matchData);
    return response.data;
};

export const joinMatch = async (matchId: number): Promise<any> => {
    const response = await apiClient.post(`/matches/${matchId}/join`);
    return response.data;
};

// -- Notificações --
export const registerFcmToken = async (fcmToken: string) => {
    const response = await apiClient.post('/users/me/register-fcm', { fcm_token: fcmToken });
    return response.data;
};

export const subscribeToRegion = async (city: string) => {
    const response = await apiClient.post('/users/me/subscriptions/region', { city });
    return response.data;
};
