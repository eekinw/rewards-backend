import express from 'express'
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();


app.use(express.json())


app.get('/rewards', async (req, res) => {
  const rewards = await prisma.reward.findMany()
  res.json(rewards)
  console.log(rewards)
})

// 

// app.get('/api/courses/:id', (req, res) => {
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) res.status(404).send('Course not found') // 404
//     res.send(course)
// });

// app.post('/api/courses', (req, res) => {

//     if (Error) {
//     res.status(400).send(Error);
//     return;
// }


// const course = {
//         id: courses.length + 1,
//         name: req.body.name
//     }
//     courses.push(course);
//     res.send(course);
// })



// /api/courses/1
// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.query)
// })

// app.delete('/api/courses/:id', (req, res) => {
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) res.status(404).send('Course not found') // 404

//     const index = courses.indexOf(course);
//     courses.splice(index, 1);

//     res.send(course)

// })

// PORT
const port = 3100;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

