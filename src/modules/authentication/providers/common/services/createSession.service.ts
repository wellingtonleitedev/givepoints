import { PrismaClient, User } from "@prisma/client";
import authConfig from "../../../../../config/auth.config";
import { sign } from "jsonwebtoken";

interface IRequest {
  userId: string;
  data: IUser;
}

interface IUser {
  name?: string;
  twitterId?: string;
  twitterToken?: string;
  twitterUsername?: string;
  twitchId?: string;
  twitchToken?: string;
  twitchUsername?: string;
}

const createSessionService = async ({ data, userId }: IRequest) => {
  let user: User | null;

  const prisma = new PrismaClient();
  user = await prisma.user.findFirst({
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
    user = await prisma.user.create({
      data: {
        name: data.name,
        twitterId: data.twitterId,
        twitterUsername: data.twitchUsername,
        twitchId: data.twitchId,
        twitchUsername: data.twitchUsername,
      },
    });
  } else {
    user = await prisma.user.update({
      data: {
        name: user.name ?? data.name,
        twitterId: user.twitterId ?? data.twitterId,
        twitterUsername: user.twitterUsername ?? data.twitchUsername,
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
      twitterToken: data.twitterToken,
      twitchToken: data.twitchToken,
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
