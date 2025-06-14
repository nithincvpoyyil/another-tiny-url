import * as express from 'express';
const app = express.default();
const port = 3000;


app.use(express.json());

// GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// POST route
app.post('/data', (req, res) => {
  const data = req.body;
  res.send(`Received data: ${JSON.stringify(data)}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});