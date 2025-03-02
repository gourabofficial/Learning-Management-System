import express from 'express';
import { getUserData, userEnrollCourse } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrollCourse);

export default userRouter;