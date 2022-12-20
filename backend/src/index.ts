import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
const app = express();

app.use(
  cors({
    origin: 'https://172.104.145.28',
  }),
);

let counter = 0;
if (fs.existsSync('./counter.txt')) {
  counter = parseInt(fs.readFileSync('./counter.txt', 'utf-8'));
}

app.get('/counter', (req, res) => {
  counter++;
  fs.writeFileSync('./counter.txt', String(counter));
  return res.status(200).json({ res: counter });
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('../client/index.html'));
});

app.listen(80, () => {
  console.log('Listening on port 80!');
});
