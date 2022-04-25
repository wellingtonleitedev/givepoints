-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'STREAMER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "twitterId" TEXT,
    "twitterUsername" TEXT,
    "twitchId" TEXT,
    "twitchUsername" TEXT,
    "role" "Role" NOT NULL DEFAULT E'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
