import { WebView } from 'react-native-webview';
import { WebEvent } from '../types';
import { trackEvent, setUserId } from '../services/airbridge';
import { sendConversion } from '../services/cpaApi';
import { login, signup } from '../services/authApi';
import { createOrder } from '../services/orderApi';
import { setAuthToken } from '../services/tokenStorage';

const sendMessageToWebView = (
  webView: WebView | null,
  message: any,
) => {
  if (webView) {
    const messageStr = JSON.stringify(message);
    // React Native WebView에서 WebView로 메시지 전송
    // WebView에서는 window.addEventListener('message', ...)로 받을 수 있습니다
    const script = `
      (function() {
        const data = ${messageStr};
        // MessageEvent를 사용하여 WebView로 메시지 전송
        window.dispatchEvent(new MessageEvent('message', { data: data }));
        // document에도 이벤트 발생 (호환성)
        document.dispatchEvent(new MessageEvent('message', { data: data }));
      })();
    `;
    webView.injectJavaScript(script);
  }
};

export const handleWebEvent = async (
  event: WebEvent,
  webView: WebView | null,
) => {
  switch (event.type) {
    case 'LOGIN':
      try {
        console.log('[WebView] LOGIN event received', { email: event.email });
        const response = await login({
          email: event.email,
          password: event.password,
        });

        console.log('[WebView] LOGIN response', response);

        // 로그인 성공 - 토큰 저장
        setAuthToken(response.accessToken);

        // Airbridge에 사용자 ID 등록 (전환 이벤트를 같은 유저로 묶기 위함)
        setUserId(response.userId);

        // 로그인 성공 - WebView로 결과 전송
        sendMessageToWebView(webView, {
          type: 'LOGIN_RESPONSE',
          success: true,
          data: response,
        });

        // 트래킹
        trackEvent('login', {});
      } catch (error) {
        console.error('[WebView] LOGIN error', error);
        // 로그인 실패 - WebView로 에러 전송
        sendMessageToWebView(webView, {
          type: 'LOGIN_RESPONSE',
          success: false,
          error:
            error instanceof Error ? error.message : '로그인에 실패했습니다.',
        });
      }
      break;

    case 'SIGN_UP':
      // SIGN_UP 이벤트 처리
      if ('name' in event && 'email' in event && 'password' in event) {
        // 웹뷰에서 온 회원가입 이벤트
        try {
          console.log('[WebView] SIGN_UP event received', {
            name: event.name,
            email: event.email,
          });

          const response = await signup({
            email: event.email,
            password: event.password,
            name: event.name,
          });

          // 회원가입 성공 - 토큰 저장
          setAuthToken(response.accessToken);

          // Airbridge에 사용자 ID 등록 (전환 이벤트를 같은 유저로 묶기 위함)
          setUserId(response.userId);

          // 회원가입 성공 - WebView로 결과 전송
          sendMessageToWebView(webView, {
            type: 'SIGN_UP_RESPONSE',
            success: true,
            data: response,
          });

          // 트래킹
          trackEvent('sign_up', {});
          sendConversion({
            type: 'SIGN_UP',
            userId: response.userId,
          });
        } catch (error) {
          console.error('[WebView] SIGN_UP error', error);
          // 회원가입 실패 - WebView로 에러 전송
          sendMessageToWebView(webView, {
            type: 'SIGN_UP_RESPONSE',
            success: false,
            error:
              error instanceof Error
                ? error.message
                : '회원가입에 실패했습니다.',
          });
        }
      } else if ('userId' in event) {
        // 기존 회원가입 완료 이벤트 (트래킹용)
        trackEvent('sign_up', {});
        sendConversion({
          type: 'SIGN_UP',
          userId: event.userId,
        });
      }
      break;

    case 'CREATE_ORDER': {
      try {
        // WebView에서 보내는 형식: { type: 'CREATE_ORDER', orderRequest: { items: [...] } } 또는 { type: 'CREATE_ORDER', items: [...] }
        const rawEvent = event as Record<string, unknown>;
        const orderRequest = rawEvent.orderRequest as { items?: Array<{ productId: number; quantity: number }> } | undefined;
        const items =
          Array.isArray(orderRequest?.items) ? orderRequest.items
          : Array.isArray(rawEvent.items) ? rawEvent.items
          : Array.isArray((rawEvent.data as Record<string, unknown>)?.items)
            ? (rawEvent.data as { items: Array<{ productId: number; quantity: number }> }).items
          : [];

        if (items.length === 0) {
          throw new Error('주문할 상품이 없습니다. items 배열을 확인해주세요.');
        }

        const orderItems = items.map(
          (item: { productId?: number; quantity?: number }) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity) || 1,
          }),
        );

        console.log('[WebView] CREATE_ORDER event received', {
          items: orderItems,
        });

        const response = await createOrder({
          items: orderItems,
        });

        // 주문 생성 성공 - WebView로 결과 전송
        sendMessageToWebView(webView, {
          type: 'CREATE_ORDER_RESPONSE',
          success: true,
          data: response,
        });

        // 트래킹
        trackEvent('purchase', { amount: response.totalAmount });
        sendConversion({
          type: 'PURCHASE',
          orderId: response.id.toString(),
          amount: response.totalAmount,
        });
      } catch (error) {
        console.error('[WebView] CREATE_ORDER error', error);
        // 주문 생성 실패 - WebView로 에러 전송
        sendMessageToWebView(webView, {
          type: 'CREATE_ORDER_RESPONSE',
          success: false,
          error:
            error instanceof Error
              ? error.message
              : '주문 생성에 실패했습니다.',
        });
      }
      break;
    }
  }
};
