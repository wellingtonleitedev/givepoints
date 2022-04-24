import { PrismaClient, User } from "@prisma/client";
import authConfig from "../../../../../config/auth.config";
import cache from "../../../../../config/cache.config";
import { sign } from "jsonwebtoken";

interface IRequest {
  userId: string;
  data: IUser;
}

interface IUser {
  name?: string;
  twitterId: string;
  twitterUsername?: string;
  twitchId: string;
  twitchUsername?: string;
}

const createSessionService = async ({ userId, data }: IRequest) => {
  let user: User | null;

  const twitchUser = JSON.parse(
    (await cache.get(`@twitch:user:${data.twitchId}`)) ?? "{}"
  );

  const prisma = new PrismaClient();
  user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          id: userId,
        },
        {
          twitchId: twitchUser?.user_id,
        },
        {
          twitterId: data.twitterId,
        },
      ],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: data.twitterUsername,
        twitterId: data.twitterId,
        twitterUsername: data.twitterUsername,
      },
    });
  } else {
    user = await prisma.user.update({
      data: {
        name: user.name ?? data.name,
        twitterId: user.twitterId ?? data.twitterId,
        twitterUsername: user.twitterUsername ?? data.twitterUsername,
        twitchId: user.twitchId ?? twitchUser.user_id,
        twitchUsername: user.twitchUsername ?? twitchUser.login,
      },
      where: {
        id: user.id,
      },
    });
  }

  const token = sign(
    {
      twitterId: data.twitterId,
      twitchId: twitchUser.twitchId,
    },
    authConfig.jwt.secret,
    {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    }
  );

  return { user, token };
};

export default createSessionService;
