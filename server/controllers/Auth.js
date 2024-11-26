const sendEmail = require("../utils/mailSender");
const Token = require("../models/Token");
const { User, validate } = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
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
            return res.status(400).json({
                message:"User with given email already exist!"
        });
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
      
  
      const message = `
                        <p>Click on the given link to verify your account:</p>
                        <a href="${process.env.API_BASE}/authApp/user/verify/${user._id}/${token.token}" style="color: blue; text-decoration: underline;">
                            Verify Your Account
                        </a>
                    `;
  
  
      await sendEmail(email, "Verification email from assignmentApp", message);
      res.json ({
        data: `An Email sent to ${email}, please verify`
      });
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
            return res.status(400).send("Link Expired  SignUp again");
        }
        
        
        await User.findByIdAndUpdate({ _id: user._id}, {verified: true}, {new:true});
        await Token.findByIdAndRemove(token._id);
        
        res.send(`
            <div>
                <p>Email verified successfully! You can now log in:</p>
                <a href="${process.env.CLIENT_APP}/login" style="color: blue; text-decoration: underline;">Login Here</a>
            </div>
        `);
          
        }catch (error) {
      res.status(400).send("An error occured");
    }
  
  }



  exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: `All fields are required`,
            });
        }

        // Check if user exists
        let existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: `User does not exist! SignUp Now`,
            });
        }

        const payload = {
            email: existingUser.email,
            id: existingUser._id,
            role: existingUser.role,
        };

        // Verify password
        if (await bcrypt.compare(password, existingUser.password)) {
            const { verified } = existingUser;
            if (!verified) {
                return res.json({
                    message:"Verify your email before login"
                });
            }

            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            existingUser = existingUser.toObject();
            existingUser.token = token;  // Add token to user
            existingUser.password = undefined;
            req.body.id = existingUser._id;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),  // Cookie validity => 3 days
                httpOnly: true,
            };

            // Create cookie and send response
            return res.status(200).cookie("token", token, options).json({
                success: true,
                message: "User logged in successfully",
                token,
                existingUser,
            });
        }

        return res.status(400).json({
            success: false,
            message: "Password is incorrect",
        });

    } catch (err) {
        return res.status(404).json({
            success: false,
            message: `Failed to login ==> ${err.message}`,
        });
    }
};




