import { clerkClient } from '@clerk/clerk-sdk-node';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import cloudinary from 'cloudinary';
import User from '../models/User.js'



// educatorController.js

export const approveEducator = async (req, res) => {
  try {
    const { userId } = req.body;

    
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

   
    await PendingEducatorRequest.deleteOne({ userId });

    res.json({ success: true, message: "Educator approved successfully!", role: "educator" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// status checking:

export const checkApprovalStatus = async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role === 'educator') {
      res.json({ role: 'educator' });
    } else {
      res.json({ role: 'pending' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





// updateRoleToEducator.js
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

  
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'pending_educator',
      }
    });

    res.json({ success: true, message: "Your request to become an educator has been submitted. Waiting for approval." });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error.message);
  }
};



// addCourse.js


export const addCourse = async (req,res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Course Thumbnail is required" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path)
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.send({ success: true, message: "Course added successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
    
  }
}

// get educator course 

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator })
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}


// get educator dashbord data 

export const educatorDashboarData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator })
    const totalCourses = courses.length;

    const courseIds = courses.map(course => course._id);

    const purchase = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    });

    const totalEarnings = purchase.reduce((sum, purchase) => sum + purchase.amount, 0);
    
    //enrollerd student with ids

    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find({
        _id: {$in: course.enrolledStudents}
      }, 'name imageUrl')
      

      students.forEach(student => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student
        });
        
      });
    }

    res.json({
      success: true, dashbordData: {
        totalEarnings, enrolledStudentsData, totalCourses
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
  
}

//get enrolled student  data with parchase data

export const getEnrolledStudentsData = async (req, res) => {
  try {
    
    const educator = req.auth.userId;
    const courses = await Course.find({ educator })
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    }).populate('userId', 'name  imageUrl').populate('courseId', 'courseTitle')

    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));
    res.json({ success: true, enrolledStudents });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}