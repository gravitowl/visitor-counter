import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Can only increase counter once per day.',
});

app.use(express.json());
app.use(
  cors({
    origin: 'https://172.104.145.28:80',
  }),
);
let counter = 0;
if (fs.existsSync('./counter.txt')) {
  counter = parseInt(fs.readFileSync('./counter.txt', 'utf-8'));
}

app.get('/increment-counter', limiter, (req, res) => {
  counter++;
  fs.writeFileSync('./counter.txt', String(counter));
  return res.sendStatus(200);
});

app.get('/get-counter', (req, res) => {
  return res.status(200).json({ res: counter });
});

app.post('/set-counter', (req, res) => {
  if (req.body.code != process.env.CODE) return res.sendStatus(401);
  if (!Number.isInteger(Number(req.body.newCounter)))
    return res.sendStatus(400);

  counter = req.body.newCounter;
  fs.writeFileSync('./counter.txt', String(counter));
  return res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('../client/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.resolve('../client/login.html'));
});

app.post('/login', (req, res) => {
  if (req.body.code == process.env.CODE) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(401);
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.resolve('../client/admin.html'));
});

app.listen(80, () => {
  console.log('Listening on port 80!');
});
