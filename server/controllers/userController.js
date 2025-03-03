import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import Stripe from 'stripe';

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



    console.log('coursePrice:', courseData.coursePrice);
    console.log('courseDiscount:', courseData.discount);


   
 
    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100)
      .toFixed(2),
    }

    const newPurchase = await Purchase.create(purchaseData);

    // stripe payment gateway
    let stripeInstanse;
    try {
      stripeInstanse = new Stripe(process.env.STRIPE_SECRET_KEY);
      console.log("Stripe Secret Key is valid")
    } catch (error) {
      console.log("Invalid Stripe Secret Key")
      
    }


    const currency = process.env.CURRENCY.toLowerCase();

    // line items for stripe
    const line_items = [{
      price_data: {
        currency,
        
        product_data: {
          name: courseData.courseTitle   
        },
        unit_amount: Math.floor(newPurchase.amount) * 100
      },
      quantity: 1
    }]
    const session = await stripeInstanse.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,
      line_items: line_items,
      mode: 'payment',
      metadata: {
        purchaseId: newPurchase._id.toString()
      }
    })

    res.json({success:true,session_url:session.url})
  } catch (error) {
    res.json({ success: false, message: error });
    console.log("Error in purchaseCourse", error);
  }
}