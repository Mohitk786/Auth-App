const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,  
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,  //5 min
    }
});

// funcion to sendmail
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, "Verification email from Learn to Grow", otp);
        console.log("Email sent Successfully: ", mailResponse);
    }catch(err){
        console.log("error occured while sending mail",err);
        throw err;
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);