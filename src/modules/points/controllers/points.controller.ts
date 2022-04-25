import "dotenv/config";
import cache from "../../../config/cache.config";
import { Request, Response } from "express";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../common/errors/appError";

export const create = async (request: Request, response: Response) => {
  const { tweetId, amount } = request.body;

  try {
    const twitterUsers = await getRetweetedUsers(
      request.user?.twitterId,
      tweetId
    );

    if (!twitterUsers) {
      throw new AppError("users that retweeted was not found");
    }

    const prisma = new PrismaClient();
    const users = await prisma.users.findMany({
      where: {
        twitterId: { in: twitterUsers.map((item) => item.id) },
      },
    });

    const { data: channel } = await axios.get(
      `${process.env.STREAMELEMENTS_URL}channels/me`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STREAMELEMENTS_BEARER_TOKEN}`,
        },
      }
    );

    const usersWithPoints = [];
    for (const user of users) {
      const { data } = await axios.put(
        `${process.env.STREAMELEMENTS_URL}points/${channel._id}/${user.twitchUsername}/${amount}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.STREAMELEMENTS_BEARER_TOKEN}`,
          },
        }
      );

      usersWithPoints.push({
        ...user,
        ...data,
      });
    }

    return response.json({ users: usersWithPoints });
  } catch (error) {
    throw new AppError("It was not possible to give points");
  }
};

const getRetweetedUsers = async (twitterId: string, tweetId: string) => {
  const { accessToken } = JSON.parse(
    (await cache.get(`@twitter:token:${twitterId}`)) ?? "{}"
  );

  try {
    const client = new TwitterApi(accessToken);

    const { data: twitterUsers } = await client.readOnly.v2.tweetRetweetedBy(
      tweetId
    );

    return twitterUsers;
  } catch (error) {
    throw new AppError("It was not possible to get info from twitter");
  }
};
