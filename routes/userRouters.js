const express = require ('express')
const { signup, login, logout, forgetPassword, resetPassword,resendOTP,verifyAccount } = require('../controller/usersController'); 
const { isAuthenticated} = require('../middlewares/isAuthenticated');

const userRoute= express.Router();

//SING UP

userRoute.post('/signup',signup);
userRoute.post('/verify',isAuthenticated,verifyAccount);
userRoute.post('/resend.otp',isAuthenticated,resendOTP)

//Login
userRoute.post('/login',login,)

//Logout
userRoute.post('/logout',logout)
//Frorget password
userRoute.post('/forget-password',forgetPassword)
userRoute.post('/reset-password',resetPassword)



module.exports = userRoute
