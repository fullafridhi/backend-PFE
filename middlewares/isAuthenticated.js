const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../model/userModel');

const isAuthenticated = catchAsync(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    
    if (!token) {
        return next(new AppError('You are not logged in, please log in to access', 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.error('Token verification error:', err); // Log the error
        return next(new AppError('Invalid token', 403));
    }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does not exist', 401));  
    }
    console.log('Authenticated User:', currentUser);
    req.user = currentUser;
    next();
});

const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
};

const isAdminOrTeacher = (req, res, next) => {
    if (!req.user) {
        console.error('User not authenticated');
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const { role } = req.user;
    console.log('User Role:', role);

    if (role !== ROLES.ADMIN && role !== ROLES.TEACHER) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
    }

    next();
};



// Middleware to check admin roleconst isAdmin = (req, res, next) => {
    const isAdmin = (req, res, next) => {
        console.log("User object:", req.user); // Check what the user object contains
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ status: 'error', message: 'Access denied. Admins only.' });
        }
        next();
    };
    


module.exports = { isAuthenticated, isAdminOrTeacher, isAdmin };
