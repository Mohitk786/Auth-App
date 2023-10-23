const {User} = require("../models/User");

exports.DeleteOne = async(req,res) => {
    try{
        const {_id} = req.body;
        await User.findByIdAndDelete({_id:_id});

        return res.status(200).json({
            success:true,
            message:"User deleted successFully",
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"something went wrong while deleting user",
        })
    }
}

exports.getUsers = async(req,res) => {
    try{
        const allUsers = await User.find({});
        res.status(200).json({
            success:true,
            message:"All user fetched successfully",
            allUsers,
        })

    }catch(err){
        console.error(`failed to get all users ${err}`)
        return res.status(400).json({
            success:false,
            message:`unable to fetch allUsers's details => ${err.message}`,
        })
    }
}


exports.GetOne = async (req, res) => {
    try {
        const {email}  = req.params;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required to find the user",
            });
        }
        
        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No such user exists, Sign Up Now",
            });
        }

       user.password = undefined;
        
        return res.status(200).json({
            success: true,
            message: "User found",
            user
        });

    } catch (err) {
        console.error(`Failed to get user: ${err.message}`);
        return res.status(500).json({
            success: false,
            message: `Unable to fetch user details => ${err.message}`,
        });
    }
};