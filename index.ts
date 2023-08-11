import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const app = express();

app.use(express.json())

interface Rewards {
  id: number,
  name: string;
  category_id: number;
  points_required: number
  is_redeemable: boolean;
  quantity: number;
  description: string;
  category: Category;
}

interface Category {
  id: number;
  title: string;

}

interface User {
  id: number;
  user_status: string;
  email: string;
  points: number
}

interface RedemptionData {
  user_id: number;
  reward_id: number;
  redemption_date: Date;
  redemption_expiry: Date
}

interface CategoryMap {
  [key: string]: number;
};

const categoryMap: CategoryMap = {
  "Clothing": 1,
  "Merchandise": 2,
  "Food": 3
};


// **REWARDS ADMIN**


// LISTING ALL USERS
app.get('/admin/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { Redemption: true}
    })
    res.status(200).json(users)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})


// LISTNG ALL REDEMPTIONS FOR A SPECIFIC USER
app.get(`/admin/users/:userId/redemptions`, async (req, res) => {
   const { userId } = req.params;

  try {
    const redemptions = await prisma.redemption.findMany({
      where: {
        user_id: parseInt(userId),
      },
    });

    res.status(200).json(redemptions);
  } catch (error: any) {
    console.error('Error fetching redemptions:', error.message);
    res.status(500).json({ error: 'Failed to fetch redemptions' });
  }
})



// LISTING ALL REWARDS
app.get('/admin/rewards', async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany(
    {
        include: { category: true }
      }
  )
  res.status(200).json(rewards)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// LISTING A CERTAIN REWARD
app.get('/admin/rewards/:id', async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id)
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
      include: {
        Redemption: { include: { user: true } },
        category: true
      }
    })
  res.status(200).json(reward)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// CREATING A NEW REWARD

app.post('/admin/rewards', async (req, res) => {
  try {
    const { name, category_title, points_required, description, quantity, is_redeemable } = req.body;

    if (!name || !category_title || !points_required || !description || !quantity || is_redeemable === undefined) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const category_id = categoryMap[category_title];
    if (!category_id) {
      return res.status(400).json({ error: "Invalid category_title provided." });
    }
    
    const rewardData = {
      name: name,
      points_required: points_required,
      description: description,
      quantity: quantity,
      is_redeemable: is_redeemable,
      category: {
        connect: {
          id: category_id
        }
      }
    };

    const reward = await prisma.reward.create({
      data: rewardData
    });

    res.json(reward);
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
    res.status(500).send('Error creating reward.');
  }
});


// DELETING A REWARD

app.delete('/admin/rewards/:id', async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id);
    console.log('Deleting reward with ID:', rewardId)
    const deletedReward = await prisma.reward.delete({
      where: { id: rewardId }
    })
    res.json(deletedReward)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
     res.status(500).send('An error occurred while deleting the reward.');
  }
})

// DELETING A REDEMPTION
app.delete('/admin/redemptions/:id', async (req, res) => {
  try {
    const redemptionId = parseInt(req.params.id);
    console.log('Deleting redemption with ID:', redemptionId);

    // 1. Fetch the redemption data first before deleting it
    const redemption = await prisma.redemption.findUnique({
      where: { id: redemptionId },
      include: {
        reward: true, 
        user: true   
      }
    });

    // Check if redemption exists
    if (!redemption) {
      return res.status(404).send('Redemption not found.');
    }

    // 2. Increase the user's points by the points that the redemption represents
    const userWithUpdatedPoints = await prisma.user.update({
      where: { id: redemption.user.id },
      data: {
        points: {
          increment: redemption.reward.points_required // Assuming your reward model has a field named `points_required`
        }, 
        redemptions: {
          decrement: 1
        }
      }
    });

    // 3. Increase the reward's quantity
    const rewardWithUpdatedQuantity = await prisma.reward.update({
      where: { id: redemption.reward.id },
      data: {
        quantity: {
          increment: 1
        }
      }
    });

    // 4. Delete the redemption
    const deletedRedemption = await prisma.redemption.delete({
      where: { id: redemptionId }
    });

    res.json({
      deletedRedemption,
      userWithUpdatedPoints,
      rewardWithUpdatedQuantity
    });

  } catch (error: any) {
    console.error('Error fetching redemptions:', error.message);
    res.status(500).send('An error occurred while deleting the redemption.');
  }
});


// EDITING A REWARD

app.put('/admin/rewards/:id', async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id);
    const { points_required, name, description, quantity } = req.body

    const updatedReward = await prisma.reward.update({
      where: { id: rewardId },
      data: {
        name,
        description,
        quantity,
        points_required,
      }
    })
    res.json(updatedReward)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// SEARCHING A REWARD (by id listed as button "click here for more details")
app.get('/admin/rewards', async (req, res) => {
  try {

  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// LISTING ALL REDEMPTIONS
app.get('/admin/redemptions', async (req, res) => {
  try {
    const redemptions = await prisma.redemption.findMany({
      include: {
        user: true
      }
    })
  res.status(200).json(redemptions)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// LISTING A CERTAIN REDEMPTION ACCORDING TO REWARD ID
app.get('/admin/rewards/:id/redemptions', async (req, res) => {
  try {
    // console.log('Request params:', req.params);
    const rewardId = parseInt(req.params.id);
    // console.log('Fetching redemptions for reward ID:', rewardId); 
    const redemptions = await prisma.redemption.findMany({
      where: { reward_id: rewardId }, 
      include: { user: true },
    });
      console.log('Redemptions:', redemptions); 
    res.status(200).json(redemptions);
  } catch (error: any) {
    console.error('Error fetching redemptions:', error.message);
    res.status(500).json({ error: 'Failed to fetch redemptions' });
  }
});


// SEARCHING A REDEMPTION



// **REWARDS AGENT**

// LISTING ALL REWARDS
app.get('/agent/rewards', async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany(
    {
        include: { category: true }
      }
  )
  res.status(200).json(rewards)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// REDEEMING A REWARD
app.post('/agent/rewards/:id/redeem', async (req, res) => {

    const rewardId = parseInt(req.params.id);
    const userId = parseInt(req.body.userId)
   
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });

    
    if (!reward || !user) {
      return res.status(404).json({ error: 'Reward or user does not exist'})
    }

    if (reward.quantity === 0) {
      return res.status(400).json({
        error: 'Reward is no longer available for redemption' })
    }

    if (user.points < reward.points_required) {
      return res.status(400).json({
        error: 'Not enough points!' })
    } 

    const redemptionDate = new Date();
    const redemptionExpiry = new Date();
    redemptionExpiry.setDate(redemptionExpiry.getDate() + 60);

    // deduct user's points
    try {
    // Transaction (Prisma)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: user.points - reward.points_required }
      }),
      prisma.reward.update({
        where: { id: rewardId },
        data: { quantity: reward.quantity - 1 }
      }),
      prisma.redemption.create({
        data: {
          user_id: userId,
          reward_id: rewardId,
          redemption_date: redemptionDate,
          redemption_expiry: redemptionExpiry
        }
      })
    ]);

    return res.status(200).json({ message: 'Redemption successful' });
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
    return res.status(500).json({ error: 'An error occurred during redemption.' });
  }
})

// LISTING A CERTAIN REWARD
app.get('/agent/rewards/:id', async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id)
    const reward = await prisma.reward.findUnique({
    where: { id: rewardId }
    })
  res.status(200).json(reward)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// LISTING ALL REDEMPTIONS
app.get('/agent/redemptions', async (req, res) => {
  try {
    const redemptions = await prisma.redemption.findMany(
      {
        include: {
        user: true
      }
    }
  )
  res.status(200).json(redemptions)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// PORT
const port = 3100;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

