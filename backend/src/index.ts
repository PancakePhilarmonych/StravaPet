import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import * as cron from 'node-cron';

import authRoutes from './routes/auth';
import coinsRoutes from './routes/coins';
import activitiesRoutes from './routes/activities';
import userRoutes from './routes/user';
import { fetchUsers } from './services/coins';
import { addCoins } from './services/coins';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/activities', activitiesRoutes);
app.use('/user', userRoutes);
app.use('/coins', coinsRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// setTimeout(() => {
//   const now = new Date().toLocaleString('en-US');
//   addCoins();
//   console.log(`🕐 Минутное уведомление: ${now} - Сервер работает нормально!`);
// }, 3000);

cron.schedule('*/10 * * * *', () => {
  const now = new Date().toLocaleString('en-US');
  addCoins();
  console.log(`🕐 Минутное уведомление: ${now} - Сервер работает нормально!`);
});

// cron.schedule('* * * * * *', () => {
//   const now = new Date().toLocaleString('en-US');
//   console.log(`🕐 Минутное уведомление: ${now} - Сервер работает нормально!`);
// });