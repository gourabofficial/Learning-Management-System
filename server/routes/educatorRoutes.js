import express from 'express';
import { addCourse, getEducatorCourses, updateRoleToEducator,educatorDashboarData, getEnrolledStudentsData, approveEducator, checkApprovalStatus } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

// add educator role 
educatorRouter.get('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', protectEducator,educatorDashboarData );
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);
educatorRouter.post('/approve-educator', approveEducator);
educatorRouter.get('/check-approval', checkApprovalStatus);

export default educatorRouter;