import express from 'express';
import { getUserData, purchaseCourse, userEnrollCourse } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrollCourse);
userRouter.post('/purchase', purchaseCourse);

export default userRouter;