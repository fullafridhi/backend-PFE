const User = require("../model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");

// TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
//This function is designed to create a JSON Web Token for a user, configure cookie options for storing that token securely, and then likely send that token back to the client in an HTTP response.
const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  };
  res.cookie("token", token, cookieOptions);
  user.password = undefined;
  user.passwordConfirm = undefined;
  user.otp = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};
//SING UP (POST)
exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, username,role} = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new AppError("Email already existed try to login", 400));

  const otp = generateOtp();

  const otpExpires = Date.now() + 24 * 60 * 60 * 1000;//after one day
  

  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    role,
    otp,
    otpExpires,
  });
  try {
    await sendEmail({
      email: newUser.email,
      subject: "OTP for email verification",
      html: `<h1> Your OTP is : ${otp}</h1>`,
    });
    createSendToken(newUser, 200, res, "registration successful");
  } catch (error) {
    console.error("Error sending email:", error);
    await User.findByIdAndDelete(newUser.id);
    return next(
      new AppError("there was an error sending the email , try again", 500)
    );
  }
});
//verify account
exports.verifyAccount = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) {
    return next(new AppError("Otp is missing.", 400));
  }
  const user = req.user;
  if (user.otp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }
  if (Date.now() > user.otpExpires) {
    return next(new AppError("OTP has expired,please request a new OTP.", 400));
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res, "Email has been verified.");
});
//request a new OTP
exports.resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.user;
  if (!email) {
    return next(new AppError("Email is required to resend OTP.", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found.", 404));
  }
  if (user.isVerified) {
    return next(new AppError("This account is already verified.", 400));
  }
  const newOtp = generateOtp();
  user.otp = newOtp;
  user.otpExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Resend otp for email verification",
      html: `<h1> Your new OTP is : ${newOtp}</h1>`,
    }),
      res.status(200).json({
        status: "success",
        message: "A new OTP has sent to your Email",
      });
  } catch (error) {
    (user.otp = undefined),
      (user.otpExpires = undefined),
      await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There is an error sending the email! please try again", 500)
    );
  }
});
//LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  //camparison between the password with the password saved in the databases

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or password", 401));
  }
  createSendToken(user, 200, res, "Login sucessful ");
  
});

//LOGOUT

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.NODE_ENV === "production",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfuly",
  });
});

//Forget password

exports.forgetPassword =catchAsync(async(req , res, next)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user){
        return next(new AppError('No user found',404));
    }
const otp = generateOtp()
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires= Date.now() + 300000; //5 minutes
    await user.save({validateBeforeSave: false});
    try {
       await sendEmail({
        email:user.email,
        subject:'your password reset OTP (valid for 5 min )',
        html: `<h1> Your password reset OTP : ${otp}</h1>`,

       });
       res.status(200).json({
        status:'success',
        message:'Password reset otp is send to your email.'

       });
    } catch (error) {
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save({validateBeforeSave:false});
        return next(new AppError('there was an error sending the email ,Please try again later'));
    }
});

//Reset Password
exports.resetPassword =catchAsync(async(req,res,next)=>{
    const{email, otp,password,passwordConfirm}= req.body;
    if (!email || !otp) {
        return next(new AppError('Email and OTP are required', 400));
    }
  // Find user with valid email, OTP, and unexpired OTP
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
        resetPasswordOTPExpires: { $gt: Date.now() },
    });
     // Log for debugging
     console.log('Reset Password Request:', { email, otp });
      
// Check if the user exists
   if(!user) return next(new AppError('No User found',400));
    // Check if password and passwordConfirm match
    if (password !== passwordConfirm) {
        return next(new AppError('Passwords do not match', 400));
    }
   //change password
   user.password = password;
   user.passwordConfirm = passwordConfirm;
   user.resetPasswordOTP = undefined;
   user.resetPasswordOTPExpires = undefined

await user.save();

createSendToken(user,200,res,'Password reset successful')
});


