import Config from 'react-native-config';
import { getAuthToken } from './tokenStorage';
import { ApiResponse } from './authApi';

const API_BASE = Config.API_URL || 'http://5.0.50.42:7777/api';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
}

export interface OrderLine {
  productId: number;
  unitPrice: number;
  quantity: number;
  amount: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  totalAmount: number;
  createdAt: string;
  items: OrderLine[];
}

export const createOrder = async (
  request: CreateOrderRequest,
): Promise<OrderResponse> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
  }

  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
    }
    const errorText = await response.text();
    throw new Error(
      `주문 생성 실패: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const result: ApiResponse<OrderResponse> = await response.json();
  return result.data;
};
