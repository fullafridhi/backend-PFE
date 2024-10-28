const mongoose = require("mongoose");

// schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },

    teacher:{
      type: String,
      require:true
    },
    teacherId:{
      type: mongoose.Schema.Types.ObjectId,
      require:true
    },
  price: {
    type: Number,
    // required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  img: {
    type: String,
    required: true,
  },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "videos" }],
  quizzes: [{ question: String, options: [String], answer: String }]
});

//  course
const Course= mongoose.model("Course", courseSchema);

module.exports = Course;