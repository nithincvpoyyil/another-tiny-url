import * as express from 'express';
const app = express.default();
const port = 3000;

import { client } from './redisClient.mjs'

app.use(express.json());

// GET route
app.get('/', async (req, res) => {
  res.send('Hello, World!');
  try {
    await client.connect().then(() => console.log('Redis Client Connected'))
  } catch (err) {
    console.log('Redis Client Error', err);
  }
  console.log('Redis Client Connected')
});

// POST route
app.post('/data', (req, res) => {
  const data = req.body;
  res.send(`Received data: ${JSON.stringify(data)}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});