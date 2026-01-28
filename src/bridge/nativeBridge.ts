interface ReactNativeWebView {
  postMessage: (message: string) => void;
}

declare const window: {
  ReactNativeWebView?: ReactNativeWebView;
} | undefined;

export const sendToNative = (payload: any) => {
    if (typeof window !== 'undefined' && window?.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify(payload),
      );
    }
  };