declare namespace Express {
  export interface Request {
    user: {
      id: string;
      twitterId: string;
      twitchId: string;
    };
  }
}
