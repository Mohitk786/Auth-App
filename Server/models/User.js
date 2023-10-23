const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    number:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    DOB:{
        type:Date,
    },
    role:{
        type:String,
        required:true,
        trim:true,
    },
    verified:{
        type:Boolean,
        required:true,
        default:false,
    }

});

const User = mongoose.model("user", UserSchema);


// Validation of data

const validate = (user) => {

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).label("password"),
    firstName: Joi.string().required().max(15),
    lastName: Joi.string().required().max(10),
    role: Joi.string().required(10),
    confirmPassword: Joi.string().required().min(8).label("confirmPassword"),
    number: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()
});
    return schema.validate(user);
};


module.exports = {
    User,
    validate,
};