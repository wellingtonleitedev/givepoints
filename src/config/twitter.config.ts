import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export default client;
