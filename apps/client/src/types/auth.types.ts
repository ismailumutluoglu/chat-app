export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// window objesine __accessToken eklemek için global tip genişletme
declare global {
  interface Window {
    __accessToken: string | null;
  }
}