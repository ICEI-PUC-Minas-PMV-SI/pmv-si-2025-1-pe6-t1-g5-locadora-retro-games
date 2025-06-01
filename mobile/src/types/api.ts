// Game types based on backend API
export interface Game {
  id: number;
  name: string;
  price: number;
  description?: string;
  amount: number;
  consoleId: number;
  console?: Console;
  consoleName?: string;
}

export interface Console {
  id: number;
  name: string;
  gamesCount?: number;
}

export interface CartItem extends Game {
  cartItemId: string;
  quantity?: number;
}

// API Response types
export interface GamesResponse {
  games: Game[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  gameWithMoreOrders?: Game;
}

export interface ConsolesResponse {
  consoles: Console[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  consoleWithMoreGames?: Console;
}

// API Request types
export interface GetGamesParams {
  page?: number;
  limit?: number;
  search?: string;
  field?: string;
  order?: 'asc' | 'desc';
}

export interface GetConsolesParams {
  page?: number;
  limit?: number;
  search?: string;
  field?: string;
  order?: 'asc' | 'desc';
}

// Order/Reserve types
export interface Order {
  id: number;
  userId: number;
  gameId: number;
  statusReserveId: number;
  reserveDate: string;
  approveDate?: string;
  returnDate?: string;
  game?: Game;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  roleId: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
