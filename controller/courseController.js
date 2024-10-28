const Course = require('../model/coursesModel')



//This code snippet is designed to handle a GET request to fetch all courses with optional filtering, sorting, and pagination. It allows users to search for courses by title, sort the results by a specified field and order, and control how many results are returned per page.

const getAllCourses = async (req, res) => {
  console.log('Received request:', req.query)
    try {
      let { q, sortBy, sortOrder, page, limit } = req.query;
      let filter = {};
      if (q) {
        filter.title = { $regex: q, $options: "i" };
      }
      const sort = {};
      if (sortBy) {
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;
      }
      page = page ? page : 1;
      limit = limit ? limit : 10;
  
      const courses = await Course
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
      
      res.status(200).json({ courses });
    } catch (err) {
      res.status(400).json({ message: "Something Went Wrong", error: err.message });
    }
  };

// get request indivual course
// EndPoint: /courses/:courseID
// FRONTEND: when user or admin want to access a specific course
const getCourseById = async (req, res) => {
    try {
      const courseID = req.params.courseID;
      const course = await Course.findById({ _id: courseID });
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json({ course });
    } catch (err) {
      res.status(400).json({ message: "Something Went Wrong", error: err.message });
    }
  };

// adding new course
// Access: Admin & teacher
// EndPoint: /courses/add;
// FRONTEND: when teacher want to add his/ her new course
const addCourse = async (req, res) => {
  try {
    
      const userRole = req.user.role; 
            if (userRole !== 'admin' && userRole !== 'teacher') {
          return res.status(403).json({ message: "Forbidden: You don't have permission to add a course." });
      }

      console.log("Request Body:", req.body); // Log the incoming request body
      const { title, description, duration, category, createdBy, teacher, teacherId, price, img,quizzes } = req.body;

      // Validate input fields (additional step)
      if (!title || !teacherId) {
          return res.status(400).json({ message: "Title, teacher ID, and price are required." });
      }

      // Check if the course already exists
      const courseExists = await Course.findOne({ title, teacherId });
      if (courseExists) {
          return res.status(403).json({ message: "Course Already Present" });
      }

      // Create a new course
      const newCourse = new Course({
          title,
          description,
          duration,
          category,
          createdBy,
          teacher,
          teacherId,
          price,
          img,
          quizzes
      });

      // Save the new course to the database
      await newCourse.save();
      res.status(201).json({ message: "Course Added", data: newCourse });
  } catch (err) {
      res.status(400).json({ message: "Something Went Wrong", error: err.message });
  }
};

  
// updating course details;
// Access: Admin & teacher;
// EndPoint: /courses/update/:courseID;
// FRONTEND: when teacher want to update his existing course
const updateCourse = async (req, res) => {
    try {
        if (req.body.role == "admin" || req.body.role == "teacher") {
          const courseID = req.params.courseID;
          const course = await Course.findByIdAndUpdate(
            { _id: courseID },
            req.body
          );
          //  console.log(course)
          if (!course) {
            res.status(404).json({ message: "course not found" });
          } else {
            res.status(202).json({ message: "course updated", course });
          }
        } else {
          res.status(401).json({ error: "you don't have access to update course" });
        }
      } catch (err) {
        res
          .status(400)
          .json({ message: "Something Went Wrong", error: err.message });
      }
    }

// course delete request;
// Access: Admin & teacher;
// EndPoint: /courses/delete/:courseID;
// FRONTEND: when admin/teacher want to delete his existing courses
const deleteCourse = async (req, res) => {
    try {
        if (req.body.role == "admin" || req.body.role == "teacher") {
          const courseID = req.params.courseID;
          const course = await Course.findByIdAndDelete({ _id: courseID });
          // console.log(course);
          if (!course) {
            res.status(404).json({ message: "course not found" });
          } else {
            res.status(200).json({ message: "course deleted", course });
          }
        } else {
          res
            .status(401)
            .json({ error: "you don't have access to delete the course" });
        }
      } catch (err) {
        res
          .status(400)
          .json({ message: "Something Went Wrong", error: err.message });
      }
    }

module.exports = {
    getAllCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
  };

















