export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  available_tickets: number;
  image_url: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  purchase_date: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_id: string;
  event?: Event;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  event_id: string;
}