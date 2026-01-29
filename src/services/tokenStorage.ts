// 간단한 토큰 저장소 (메모리 기반)
// 필요시 AsyncStorage로 변경 가능

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
};
