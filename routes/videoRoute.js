const express = require('express');
const {
    getAllVideos,
    getVideoById,
    addVideo,
    getCourseVideos
} = require('../controller/videoController');
const { isAuthenticated, isAdminOrTeacher,isAdmin } = require('../middlewares/isAuthenticated');

const videoRoute = express.Router();

videoRoute.use(isAuthenticated);

// Admin only route
videoRoute.get('/', isAdmin, getAllVideos);

// Teacher and Admin route for adding videos
videoRoute.post('/:courseId',isAuthenticated, isAdminOrTeacher, addVideo);

// Route to get a specific video
videoRoute.get('/:videoID', getVideoById);

// Get videos for a specific course
videoRoute.get('/course/:courseId', getCourseVideos);

module.exports = videoRoute;
