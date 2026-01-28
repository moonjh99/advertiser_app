import { WebView } from 'react-native-webview';
import { WebEvent } from '../types';
import { trackEvent } from '../services/airbridge';
import { sendConversion } from '../services/cpaApi';
import { login, signup } from '../services/authApi';

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

        // 로그인 성공 - WebView로 결과 전송
        sendMessageToWebView(webView, {
          type: 'LOGIN_RESPONSE',
          success: true,
          data: response,
        });

        // 트래킹
        trackEvent('user', 'login');
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

          // 회원가입 성공 - WebView로 결과 전송
          sendMessageToWebView(webView, {
            type: 'SIGN_UP_RESPONSE',
            success: true,
            data: response,
          });

          // 트래킹
          trackEvent('user', 'sign_up');
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
        trackEvent('user', 'sign_up');
        sendConversion({
          type: 'SIGN_UP',
          userId: event.userId,
        });
      }
      break;

    case 'PURCHASE':
      trackEvent('order', 'purchase', event.amount);
      sendConversion({
        type: 'PURCHASE',
        orderId: event.orderId,
        amount: event.amount,
      });
      break;
  }
};
