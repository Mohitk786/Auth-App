const express = require("express");
const router = express.Router(); 

const {SignUp, Login, VerifyUser} =  require("../controllers/Auth");
const {DeleteOne, getUsers} = require("../controllers/Operations");
const {auth, isAdmin, isStudent} = require("../middleware/auth")

router.post("/signup", SignUp)
router.get("/user/verify/:id/:token", VerifyUser);
router.post("/login", Login);
router.get("/getAllUsers",auth, isAdmin,  getUsers);
router.post("/deleteUser/:id", auth, DeleteOne);



module.exports = router;
