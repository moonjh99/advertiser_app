import React from 'react';
import ShopWebViewScreen from './screens/ShopWebviewScreen';
import { useFirstOpen } from './hooks/useFirstOpen';

export default function App() {
  useFirstOpen();
  return <ShopWebViewScreen />;
}