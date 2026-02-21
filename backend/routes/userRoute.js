import express from 'express';
import { loginUser, registerUser, adminLogin, forgotPasswordRequest, forgotPasswordReset } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/forgot-password/request', forgotPasswordRequest)
userRouter.post('/forgot-password/reset', forgotPasswordReset)

export default userRouter;