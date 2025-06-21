import express from "express";
import { getUserInfo, loginUser, logoutUser, registerUser } from "../Controllers/user.controller.js";
import { verifyToken } from "../Middleware/auth.middleware.js";
import { adminOnly } from "../Middleware/role.middleware.js";


const router = express.Router();

//Route for user registration
router.post("/register", registerUser);

//Route for login user
router.post("/login", loginUser);

//Protected ROUTE using JWT middleware
router.get("/me", verifyToken, getUserInfo);

//Route for logout
router.post("/logout", verifyToken, logoutUser);

//Route for admin-only
router.get("/admin-data", verifyToken, adminOnly, (req,res)=>{
    res.status(200).json({message: "Welcome Admin! You have access to this protected data.", });
});

export default router;