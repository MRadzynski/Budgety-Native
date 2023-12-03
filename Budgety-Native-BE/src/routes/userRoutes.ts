import express from 'express';
import { authChecker } from '../middlewares/authChecker';
import {
  handleDeleteUser,
  handleForgotPassword,
  handleResetPassword,
  loginUser,
  signupUser,
  updateCurrency,
  updateLanguage,
  updateUsername
} from '../controllers/userController';

const router = express.Router();

router.post('/login', loginUser);

router.post('/forgot-password', handleForgotPassword);

router.post('/reset-password', handleResetPassword);

router.post('/signup', signupUser);

router.use(authChecker);

router.delete('/delete-user', handleDeleteUser);

router.patch('/update-currency', updateCurrency);

router.patch('/update-language', updateLanguage);

router.patch('/update-username', updateUsername);

export default router;
