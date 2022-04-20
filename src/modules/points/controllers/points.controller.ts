import { Request, Response } from "express";
import { TwitterApi } from "twitter-api-v2";

export const create = async (request: Request, response: Response) => {
  const { tweetId, amount } = request.body;

  try {
    const client = new TwitterApi(request.user?.twitterToken!);

    const { data } = await client.readOnly.v2.tweetRetweetedBy(tweetId);

    return response.json(data);
  } catch (error) {
    console.log({ error });
  }
};
