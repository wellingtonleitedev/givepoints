import { PrismaClient, Users } from "@prisma/client";
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
  let user: Users | null;

  const prisma = new PrismaClient();
  user = await prisma.users.findFirst({
    where: {
      OR: [
        {
          id: userId,
        },
        {
          twitchId: data.twitchId,
        },
        {
          twitterId: data.twitterId,
        },
      ],
    },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
        name: data.name,
        twitterId: data.twitterId,
        twitterUsername: data.twitterUsername,
        twitchId: data.twitchId,
        twitchUsername: data.twitchUsername,
      },
    });
  } else {
    user = await prisma.users.update({
      data: {
        name: user.name ?? data.name,
        twitterId: user.twitterId ?? data.twitterId,
        twitterUsername: user.twitterUsername ?? data.twitterUsername,
        twitchId: user.twitchId ?? data.twitchId,
        twitchUsername: user.twitchUsername ?? data.twitchUsername,
      },
      where: {
        id: user.id,
      },
    });
  }

  const token = sign(
    {
      twitterId: data.twitterId,
      twitchId: data.twitchId,
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
