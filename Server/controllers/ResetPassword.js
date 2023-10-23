const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//reset PasswordToken ==> provides a link to reset password
exports.resetPasswordToken = async(req,res) =>{

    try{
    
    const email = req.body.email;
    
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Your email is not registerd with us."
        })}
    
    
    //generate token
    const token = crypto.randomUUID(); //generate a random UUID 
    
    const updatedDetails = await User.findOneAndUpdate(
        {email:email},
        {
        token:token,
        resetPasswordToken:Date.now() + 5*60*60*1000,
        },
        {new:true},
    )

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(email,"Password Reset Link", `Password Reser Link: ${url}`)
    
    // return response
        res.status(200).json({
            success:true,
            message:"Email Sent successfully, check your email"
        })


}catch(err){
    return res.status(400).json({
        success:false,
        message:"Something went wrong while sending pwd reset link"
    })};

}



//reset password ==> actual password updation in DB
exports.resetPassword = async(req,res) =>{
    try{
        //fetch data
        const {password, confirmPassword, token} = req.body;
       
        //validation
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password did not match"
            });
        }

        const userDetails = await User.findOne({token:token});
       
        //if no entry ==> Invalid token
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Invalid token"
            }); 
        }

        if(userDetails.resetPasswordExpire < Date.now() ){
            //token is expired
            return res.status(400).json({
                success:false,
                message:"token is expired, please regenerate the token",
            }); 
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        //update the password
        await User.findOneAndUpdate(
            {token:token},
            {password : hashedPassword},
            {new:true},
        )
        //return response
        return res.status(200).json({
            success:true,
            message:"password reset successfully",
        })


    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Something went wrong while reseting password"
        })};
    
}
