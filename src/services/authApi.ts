import Config from 'react-native-config';

const API_BASE = Config.API_URL || 'http://5.0.50.42:7777/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const login = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Login failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const result: ApiResponse<LoginResponse> = await response.json();
  return result.data;
};

export const signup = async (
  request: SignupRequest,
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Signup failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const result: ApiResponse<LoginResponse> = await response.json();
  return result.data;
};
