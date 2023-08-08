import { USER_STATUS, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        {
          user_status: USER_STATUS.active,
          email: 'jonathan@supahands.com',
          points: 0,
          redemptions: 10
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
        {
          title: 'Food'
        }
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
          points_required: 50,
          quantity: 30,
          is_redeemable: true,
        },
        {
          category_id: 2, 
          name: 'SUPA Mug',
          description: 'Just a mug',
          points_required: 30,
          quantity: 50,
          is_redeemable: true,
        },
      ],
    });

    // Seed the Redemption model with multiple records
    await prisma.redemption.createMany({
      data: [
        {
          user_id: 1,
          reward_id: 1, 
          redemption_expiry: new Date('2023-12-31'), // Example expiry date
        },
        {
          user_id: 2, 
          reward_id: 2, 
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