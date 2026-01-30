import React, { useRef, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { handleWebEvent, sendGoBackToWebView } from '../bridge';
import Config from 'react-native-config';

export default function ShopWebViewScreen() {
  const webViewRef = useRef<WebView>(null);

  // 네이티브 뒤로가기 버튼: WebView로 GO_BACK 전송 (웹에서 history.back 또는 WEBVIEW_CANNOT_GO_BACK 응답)
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      sendGoBackToWebView(webViewRef.current);
      return true; // 기본 동작(앱 종료/이전 화면) 방지
    });
    return () => subscription.remove();
  }, []);

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: Config.WEBVIEW_URL || 'http://5.0.50.42:3000' }}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        handleWebEvent(data, webViewRef.current);
      }}
    />
  );
}
