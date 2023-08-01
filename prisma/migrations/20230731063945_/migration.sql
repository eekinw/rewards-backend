-- DropForeignKey
ALTER TABLE "Redemption" DROP CONSTRAINT "Redemption_reward_id_fkey";

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;
