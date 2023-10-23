const express = require("express");
const router = express.Router(); 

const {SignUp, Login, VerifyUser} =  require("../controllers/Auth");
const {DeleteOne,GetOne, getUsers} = require("../controllers/Operations");

router.post("/signUp", SignUp)
router.get("/user/verify/:id/:token", VerifyUser);
router.post("/login", Login);
router.get("/getAllUsers",  getUsers);
router.get("/getOne/:email", GetOne);
router.post("/deleteUser", DeleteOne);



module.exports = router;
