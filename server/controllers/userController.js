import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId)

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// userEnrollCourse with lecture link

export const userEnrollCourse = async (req, res) => {
   try {
    const userId = req.auth.userId;
     const userData = await User.findById(userId).populate('enrolledCourses');
     
     res.json({ success: true, enrolledCoureses: userData.enrolledCourses });
   } catch (error) {
    res.json({ success: false, message: error.message });
   }
}
 
// purshase course 

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);


    if (!userData || !courseData) {
      return res.json({success:false,message:"Data not found"});
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (courseData.coursePrice - courseData.courseDiscount * courseData.coursePrice / 100)
      .toFixed(2),
    }

    const newPurchase = await Purchase.create(purchaseData);

    // stripe payment gateway


  } catch (error) {
    res.json({ success: false, message: error });
  }
}