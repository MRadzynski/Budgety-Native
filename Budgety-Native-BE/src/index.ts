import dotenv from 'dotenv';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import { authChecker } from './middlewares/authChecker';
import { logger } from './middlewares/logger';

dotenv.config();

const app: Application = express();
const port = Number(process.env.PORT) || 8000;

app.use(express.json());
app.use(logger);
// app.use(authChecker);

app.use('/api/user', userRoutes);

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
