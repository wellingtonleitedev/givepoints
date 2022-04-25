-- CreateTable
CREATE TABLE "giveaways" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tweetId" TEXT NOT NULL,

    CONSTRAINT "giveaways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "giveaways_users" (
    "id" TEXT NOT NULL,
    "fk_id_giveaway" TEXT NOT NULL,
    "fk_id_user" TEXT NOT NULL,
    "distributed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "giveaways_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "giveaways_users" ADD CONSTRAINT "giveaways_users_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "giveaways_users" ADD CONSTRAINT "giveaways_users_fk_id_giveaway_fkey" FOREIGN KEY ("fk_id_giveaway") REFERENCES "giveaways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
