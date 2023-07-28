import { USER_STATUS, REDEMPTION_STATUS, PrismaClient } from '@prisma/client';
import { exit } from 'process';

export const prisma = new PrismaClient();


async function seed() {
  try {
    // Seed the User model with multiple records
    await prisma.user.createMany({
      data: [
        {
          user_status: USER_STATUS.active,
          email: 'eekin@supahands.com',
          points: 100,
          redemptions: 5,
        },
        {
          user_status: USER_STATUS.inactive,
          email: 'noah@supahands.com',
          points: 50,
          redemptions: 2,
        },
      ],
    });

    // Seed the Category model with multiple records
    await prisma.category.createMany({
      data: [
        {
          title: 'Clothing',
        },
        {
          title: 'Merchandise',
        },
        // Add more categories as needed
      ],
    });

    // Seed the Reward model with multiple records
    await prisma.reward.createMany({
      data: [
        {
          category_id: 1, 
          name: 'SUPA Shirt',
          description: 'White SUPA Shirt',
          category_title:  "Clothing",
          quantity: 30,
          is_redeemable: true,
        },
        {
          category_id: 2, 
          name: 'SUPA Mug',
          description: 'Just a mug',
          category_title:  "Merchandise",
          quantity: 50,
          is_redeemable: true,
        },
        // Add more rewards as needed
      ],
    });

    // Seed the Redemption model with multiple records
    await prisma.redemption.createMany({
      data: [
        {
          user_id: 1,
          reward_id: 1, 
          status: REDEMPTION_STATUS.redeemed,
          redemption_expiry: new Date('2023-12-31'), // Example expiry date
        },
        {
          user_id: 2, 
          reward_id: 2, 
          status: REDEMPTION_STATUS.unredeeemed,
          redemption_expiry: new Date('2023-12-15'), // Example expiry date
        },
        // Add more redemptions as needed
      ],
    });

    console.log('Seed data successfully inserted.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect()
    process.exit(1)
  }
}

seed();