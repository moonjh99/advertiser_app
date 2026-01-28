import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { handleWebEvent } from '../bridge/webviewBridge';
import Config from 'react-native-config';

export default function ShopWebViewScreen() {
  const webViewRef = useRef<WebView>(null);

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
