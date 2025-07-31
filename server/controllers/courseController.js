import Course from "../models/Course.js";

// get the all course 

export const getAllCourse = async (req,res) => {
  try {
    // Add timeout and optimize query
    const courses = await Course.find({
      isPublished: true
    })
    .select(["-courseContent", '-enrolledStudents'])
    .populate({
      path: 'educator',
      select: 'name email imageUrl' // Only select necessary fields
    })
    .lean() // Return plain JavaScript objects for better performance
    .limit(100) // Limit results to prevent timeout
    .exec();
    
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}


//get course Id
export const getCourseId = async (req, res) => {
  const {id} = req.params
  try {
    const courseData = await Course.findById(id).populate({ path: 'educator' })
    

    //remove the lectureUrl..

    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = ""
        }
      });
    });
    res.json({success:true,courseData})
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}