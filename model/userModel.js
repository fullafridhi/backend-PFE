const mongoose = require('mongoose');
const validator =require('validator')
const bcrypt = require ('bcryptjs')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'please provide username'],
        trim:true,
        minlenght:3,
       
        index:true
    },
    email:{
        type:String, 
        required: [true,'please provide an email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    password:{
        type:String, 
        required: [true,'please provide a password'],
        minlength: 8, 
        select :false,

    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password; // Correct validation method
            },
            message: 'Passwords do not match' 
        }
    },
    role:{
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'user',
        required: [true, 'please provide a role']
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    otp:{
        type:String,
        default:null,
    },
    otpExpires:{
        type:Date,
        default:null,
    },
    resetPasswordOTP:{
        type:String,
        default:null,
    },
    resetPasswordOTPExpires:{
        type:Date,
        default:null

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    subscription:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    }]
},
{
    timestamps:true,
});
// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
   
    if (!this.isModified('password')) return next();

        this.password = await bcrypt.hash(this.password,12);
        this.passwordConfirm =undefined;
        next()

})
//comparison between  the PW tha user sended to the PW restored in the DB
 userSchema.methods.correctPassword = async function (password,userPassword) {
    return await bcrypt.compare(password,userPassword)
 };




 const User = mongoose.model('User',userSchema);
  module.exports = User;