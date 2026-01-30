export type WebEvent =
  | { type: 'LOGIN'; email: string; password: string }
  | { type: 'SIGN_UP'; name: string; email: string; password: string }
  | { type: 'SIGN_UP'; userId: string }
  | { type: 'CREATE_ORDER'; orderRequest: { items: Array<{ productId: number; quantity: number }> } }
  | { type: 'CREATE_ORDER'; items: Array<{ productId: number; quantity: number }> }
  | { type: 'WEBVIEW_CANNOT_GO_BACK' };
