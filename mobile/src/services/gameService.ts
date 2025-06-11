import api from './api';
import { 
  Game, 
  Console, 
  GamesResponse, 
  ConsolesResponse, 
  GetGamesParams, 
  GetConsolesParams,
  LoginRequest,
  LoginResponse 
} from '../types/api';

class GameService {
  // Get games with pagination and search
  static async getGames(params: GetGamesParams = {}): Promise<GamesResponse> {
    const {
      page = 1,
      limit = 10,
      search = '',
      field = 'name',
      order = 'asc'
    } = params;

    const response = await api.get('/games', {
      params: {
        page,
        limit,
        search,
        field,
        order
      }
    });

    return response.data;
  }

  // Get all games for dropdown/selection (no pagination)
  static async getAllGames(): Promise<Game[]> {
    const response = await api.get('/games', {
      params: {
        limit: 1000, // Get all games
        page: 1
      }
    });

    return response.data.games || [];
  }

  // Get single game by ID
  static async getGameById(id: number): Promise<Game> {
    const response = await api.get(`/games/${id}`);
    return response.data;
  }
}

class ConsoleService {
  // Get consoles with pagination and search
  static async getConsoles(params: GetConsolesParams = {}): Promise<ConsolesResponse> {
    const {
      page = 1,
      limit = 10,
      search = '',
      field = 'name',
      order = 'asc'
    } = params;

    const response = await api.get('/consoles', {
      params: {
        page,
        limit,
        search,
        field,
        order
      }
    });

    return response.data;
  }

  // Get all consoles for dropdown/selection
  static async getAllConsoles(): Promise<Console[]> {
    const response = await api.get('/consoles', {
      params: {
        limit: 100,
        page: 1
      }
    });

    return response.data.consoles || [];
  }
}

class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  // Create order/reserve
  static async createOrder(gameList: number[]): Promise<boolean> {
    const response = await api.post('/orders', { gameList });
    return response.data;
  }

  // Get user orders
  static async getUserOrders(): Promise<any[]> {
    const response = await api.get('/orders/user');
    return response.data;
  }

  // Checkout order
  static async checkout(orderId: number): Promise<string> {
    const response = await api.post(`/orders/checkout/${orderId}`);
    return response.data;
  }
}

export { GameService, ConsoleService, AuthService };
