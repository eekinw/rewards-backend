-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "REDEMPTION_STATUS" AS ENUM ('redeemed', 'unredeeemed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_status" "USER_STATUS" NOT NULL,
    "email" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "redemptions" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "category_title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "is_redeemable" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reward_id" INTEGER NOT NULL,
    "status" "REDEMPTION_STATUS" NOT NULL,
    "redemption_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redemption_expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_category_id_key" ON "Reward"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_user_id_key" ON "Redemption"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_reward_id_key" ON "Redemption"("reward_id");

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
