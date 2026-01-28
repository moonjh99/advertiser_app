import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default function LoadingView() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12 }}>쇼핑몰 로딩 중...</Text>
    </View>
  );
}
