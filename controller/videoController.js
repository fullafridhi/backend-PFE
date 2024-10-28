const Course = require('../model/coursesModel');
const VideoModel = require('../model/videoModel');

// Get all videos (Admin only)
const getAllVideos = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "You don't have access to view all videos" });
        }

        const videos = await VideoModel.find({});
        res.status(200).json(videos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something Went Wrong', error: err.message });
    }
};

// Get single video
const getVideoById = async (req, res) => {
    try {
        const videoID = req.params.videoID;
        const video = await VideoModel.findById(videoID);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ video });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something Went Wrong', error: err.message });
    }
};

// Add video (Admin & Teacher)
const addVideo = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'admin' && role !== 'teacher') {
            return res.status(403).json({ error: "You don't have access to add a video" });
        }

        const { title, description, link } = req.body;
        const courseId = req.params.courseId;

        if (!title || !link) {
            return res.status(400).json({ error: 'Title and link are required' });
        }

        const existingVideo = await VideoModel.findOne({ title, link });
        if (existingVideo) {
            return res.status(400).json({ error: 'Video already present' });
        }

        const video = new VideoModel({ ...req.body, courseId, teacher: req.user.username, teacherId: req.user._id });
        await video.save();

        const updatedCourse = await Course.findByIdAndUpdate(courseId, { $push: { videos: video._id } }, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(201).json({ message: 'Video added', video });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong', error: 'Internal Server Error' });
    }
};

// Get videos for a specific course
const getCourseVideos = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId).populate('videos');

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something Went Wrong', error: err.message });
    }
};

module.exports = {
    getAllVideos,
    getVideoById,
    addVideo,
    getCourseVideos,
};
