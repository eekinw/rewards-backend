import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const app = express();


app.use(express.json())

interface Rewards {
  id: number,
  name: string;
  category_id: number;
  category_title: string;
  points_required: number
  is_redeemable: boolean;
  quantity: number;
  description: string;
}

interface RedemptionData {
  user_id: number;
  reward_id: number;
  redemption_date: Date;
  redemption_expiry: Date
}

// **REWARDS ADMIN**


// LISTING ALL USERS
app.get('/admin/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// LISTING ALL REWARDS
app.get('/admin/rewards', async (req, res) => {
  try {
  const rewards = await prisma.reward.findMany()
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
    where: { id: rewardId }
    })
  res.status(200).json(reward)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// CREATING A NEW REWARD

app.post('/admin/rewards', async (req, res) => {
  try {
    const { name, category_id, category_title, points_required, description, quantity, is_redeemable } = req.body as Rewards
    const rewards = await prisma.reward.create({
      data: {
        name: name,
        category_id: category_id,
        category_title: category_title,
        points_required: points_required,
        description: description,
        quantity: quantity,
        is_redeemable: is_redeemable
      },
    });
    res.json(rewards)
  } catch (error: any) {
     console.error('Error fetching rewards:', error.message);
  }
})

// DELETING A REWARD

app.delete('/admin/rewards/:id', async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id);
    console.log('Deleting reward with ID:', rewardId)
    const deletedReward = await prisma.reward.delete({
      where: { id: rewardId}
    })
    res.json(deletedReward)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// EDITING A REWARD

app.put('/admin/:id', async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id);
    const { category_id, category_title, points_required, name, description, quantity } = req.body

    const updatedReward = await prisma.reward.update({
      where: { id: rewardId },
      data: {
        category_id,
        category_title,
        points_required,
        name,
        description,
        quantity
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



// SEARCHING A REDEMPTION



// **REWARDS AGENT**

// LISTING ALL REWARDS
app.get('/user/rewards', async (req, res) => {
  try {
  const rewards = await prisma.reward.findMany()
  res.status(200).json(rewards)
  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
  }
})

// REDEEMING A REWARD
app.post('/user/rewards/:id/redeem', async (req, res) => {
  try {
    const rewardId = parseInt(req.params.id);
    const userId = 1;
   
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    const user = await prisma.user.findUnique({ where: { id: userId } })
    
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

    // redemption
    await prisma.reward.update({
      where: { id: rewardId },
      data: { quantity: reward.quantity - 1}
    })
    

    const redemptionData: RedemptionData = {
      user_id: userId,
      reward_id: rewardId,
      redemption_date: redemptionDate,
      redemption_expiry: redemptionExpiry
    };

    //insert new redemption in the database
    await prisma.redemption.create({
      data: redemptionData
    })

  } catch (error: any) {
    console.error('Error fetching rewards:', error.message);
    return res.status(500).json({ error: 'An error occurred during redemption.' });
  }
})

// LISTING A CERTAIN REWARD
app.get('/user/rewards/:id', async (req, res) => {
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
app.get('/user/redemptions', async (req, res) => {
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

