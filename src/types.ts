export type WebEvent =
  | { type: 'LOGIN'; email: string; password: string }
  | { type: 'SIGN_UP'; name: string; email: string; password: string }
  | { type: 'SIGN_UP'; userId: string }
  | { type: 'PURCHASE'; orderId: string; amount: number };
