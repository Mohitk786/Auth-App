const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, message) => {
    try{
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            service:"gmail",
            secure: true,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
        })

        const mailOptions = {
            from: "Authentication App",
            to:      email,
            subject: title,
            html:   message,
            
        }

        let info = transporter.sendMail(mailOptions, (error,info) => {
            if (error) {
                return console.log("Error in sending verification email ",error);
            }
            console.log('Verification Email sent succussfully');
            })

        return info;
        
        }catch(err){
        console.log(err.message);
    }
};


module.exports = mailSender;