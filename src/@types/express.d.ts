declare namespace Express {
  export interface Request {
    user: {
      id: string;
      twitterToken?: string;
      twitchToken?: string;
    };
    session: {
      url?: string;
      state: string;
      codeVerifier: string;
    };
  }
}
