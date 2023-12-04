import cron from 'node-cron';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import financeRoutes from './routes/financeRoutes';
import userRoutes from './routes/userRoutes';
import { addHistoryLogsForAllUsers } from './scheduledActions/addHistoryLogsForAllUsers';
import { logger } from './middlewares/logger';

dotenv.config();

const app: Application = express();
const port = Number(process.env.PORT) || 8000;

cron.schedule('0 0 1 * *', addHistoryLogsForAllUsers);

app.use(express.json());
app.use(logger);

app.use('/api/user', userRoutes);
app.use('/api/finance', financeRoutes);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(port, () =>
      console.log(`Connection successful, listening on port: ${port}`)
    );
  })
  .catch(error => {
    console.error(`An Error occurred: ${error}`);
  });
