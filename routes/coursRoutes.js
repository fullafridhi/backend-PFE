// routes/courseRoute.js
const express = require("express");
const {isAdminOrTeacher,isAuthenticated } = require('../middlewares/isAuthenticated');
const {getAllCourses,getCourseById,addCourse,updateCourse, deleteCourse,} = require("../controller/courseController");

  
  
  

const router = express.Router();
// route.use(isAuthenticated,);


// Route definitions
router.get("/courses", getAllCourses);
router.get("/:courseID",isAuthenticated, getCourseById);
router.post("/addcourse",isAdminOrTeacher , addCourse);
router.put("/update/:courseID", isAdminOrTeacher, updateCourse);
router.delete("/delete/:courseID", isAdminOrTeacher, deleteCourse);

module.exports = router;
