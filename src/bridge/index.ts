// Re-export from webviewBridge (use exact filename for module resolution)
import * as webviewBridge from './webviewBridge';

export const handleWebEvent = webviewBridge.handleWebEvent;
export const sendMessageToWebView = webviewBridge.sendMessageToWebView;
export const sendGoBackToWebView = webviewBridge.sendGoBackToWebView;
