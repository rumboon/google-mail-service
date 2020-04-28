declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        COOKIE_SECRET: string;
        COOKIE_NAME: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        CALLBACK_URL: string;
        AUTH_URL: string;
        TOKEN_URL: string;
    }
  }