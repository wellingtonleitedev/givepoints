declare namespace Express {
  export interface Request {
    session: {
      url?: string;
      state: string;
      codeVerifier: string;
    };
  }
}
