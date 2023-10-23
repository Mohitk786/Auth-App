const sendEmail = require("../utils/mailSender");
const Token = require("../models/Token");
const { User, validate } = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");



exports.SignUp = async (req, res) => {
    try {
  
      const {firstName, lastName, email, password, confirmPassword, number, role} = req.body;
      
      if(password != confirmPassword){
          res.status(200).send("Passwords do not match");
        }
  
        
        const  {error}  = validate(req.body);
        if (error){
          return res.status(400).send(error.details[0].message);
        }
      
      let user = await User.findOne({ email: req.body.email });
      if (user){
          return res.status(400).send("User with given email already exist!");
      }
      
      //hash the password
      const hashedPassword = await bcrypt.hash(password,10);
      
      user = await new User({
          firstName:firstName,
          lastName:lastName,
          email:email,
          number:number,
          role:role,
          password:hashedPassword,
      }).save();
  
      
      let token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
          expiresIn: 10*24*60*60
      }).save();
      
  
      const message = `Click the on the given link to verify your authApp account ${process.env.API_BASE}/user/verify/${user.id}/${token.token}`;
  
      await sendEmail(email, "Verification email from authApp", message);
      res.send(`An Email sent to ${email}, please verify`);
    } 
    
    catch (error) {
      res.status(400).send("An error occured");
    }
    
};



exports.VerifyUser = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.params.id });
        if (!user){
            return res.status(400).send("Link expired! SignUp again");
        }
        
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        
        if (!token){
            await User.findByIdAndRemove({_id:user._id});
            return res.status(400).send("Link Expired 2 SignUp again");
        }
        
        
        await User.findByIdAndUpdate({ _id: user._id}, {verified: true}, {new:true});
        await Token.findByIdAndRemove(token._id);
        
          res.send(`email verified sucessfully you can Now login  ${process.env.API_BASE}/login`);
          
        }catch (error) {
      res.status(400).send("An error occured");
    }
  
  }



exports.Login = async(req,res) => {
    try{
        const {email, password} = req.body;

        //validation
        if(!email || !password){ 
            return res.status(404).json({
                success:false,
                message:`All fields are required`,
            })  
        }

        //check if user exist or not
        let existingUser = await User.findOne({email});
      

        if( !existingUser ){
            return res.status(400).json({
                success:false,
                message:`User does not exist! SignUp Now`,
            })
        }


        const payload = {
            email: existingUser.email,
            id:    existingUser._id,
            role:  existingUser.role, 
         }


         //verify the password
        if(await bcrypt.compare(password, existingUser.password)){
            
            const {verified} = existingUser;
            if(!verified){
                return res.send("Verify your email before login")
            }

            let token = jwt.sign(payload,
                process.env.JWT_SECRET, 
                {
                    expiresIn:"2h",

                });

            existingUser = existingUser.toObject();
            existingUser.token = token;  //add token to user
            existingUser.password = undefined;
            req.body.id = existingUser._id;

            const options = {
                expires: new Date(Date.now() + 3*24*60*1000),  //cookie validity => 3days
                httpOnly :true,
            }

            //creation of cookie => response
            return res.status(200).cookie("token", token, options).status(200).json({
                success:true,
                message:"user logged in successfully",
                token,
                existingUser,
            })
        }
        return res.status(400).json({
            success:false,
            message:"password is incorrect"
        });

    }catch(err){
        return res.status(404).json({
            success:false,
            message:`failed to login ==> ${err.message}`,
        })
    }
}


//Update details
exports.UpdateProfile = async (req,res) => {
    try{
        const {number, DOB, firstName, lastName, _id} = req.body;
        
        if(!number || !DOB || !firstName || !lastName){
            return res.status(404).json({
                success:false,
                message:`all fields are required`,
            })
        }

        const user = await User.findByIdAndUpdate({_id}, 
            {
                number : number,
                DOB : DOB,
                firstName : firstName,
                lastName: lastName,
            },
            {new:true},
            )

        res.status(200).json({
            success:true,
            message:"details updated successfully",
            user
        })

    }catch(err){
        console.error(`update details error ${err}`)
        return res.status(400).json({
            success:false,
            message:`failed to Update Details => ${err.message}`,
        })
    }
}


//at signup time
exports.sendOTP = async(req,res) => {
    try{
        const {email} = req.body;
        const existUser = await User.findOne({email});

        //user Already exist
        if(existUser){
            return res.status(400).json({
                success: false,
                message: "User Already Exist",
            })
        }

        //generate otp
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false, 
        })

        const uniqeOTP = await OTP.findOne({otp:otp});
        while(uniqeOTP){
            //generate otp until it is unique
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
        });
        uniqeOTP = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload);

        res.status(200).json({
            success:true,
            message:"OTP sent Successfully",
        });

    }catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:err.message,
        })
    }
}