const express = require('express');
const { getUserData,addUserData,updateUserData,deleteUser } = require("../controller/adminController");
    
    
    
const {isAuthenticated, isAdmin}= require('../middlewares/isAuthenticated');

const adminRoute = express.Router();

// adminRoute.use(isAuthenticated);

adminRoute.post('/addUser',isAuthenticated,isAdmin, addUserData);
adminRoute.put('/updateUser/:id',isAuthenticated,isAdmin,updateUserData);
adminRoute.delete('/deleteUser/:id',isAuthenticated,isAdmin,deleteUser); 
adminRoute.get('/getUser',isAuthenticated,isAdmin,getUserData); 


module.exports = adminRoute 

