import User from "../Models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//Register controller
export const registerUser = async(req,res)=>{
    try {
        const {username, email, password, role} = req.body;

        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        //Hash the password 
        const salt = await bcrypt.genSalt(10);             //10=> saltrounds
        const hashPassword = await bcrypt.hash(password, salt);        //hash the password

        //create the new user
        const newUser = new User({
            username,
            email,
            password: hashPassword,
            role,
        });

        //Save to database
        await newUser.save();

        res.status(201).json({message: "User registered successfully!"});
    } catch (error) {
        res.status(500).json({message: "Registration failed", error:error.message});
    }
};


//Login controller
export const loginUser = async(req,res)=>{
    try {
        const {email, password} = req.body;
        
        //1.Check if user exists
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({message: "User Not Found"});
        }

        //2. Compare entered password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            res.status(401).json({message: "Invalid credentials"});
        }

        //3.Generate JWT token
        const token = jwt.sign({
        userId: user._id,
        email: user.email,
        role: user.role
        }, process.env.JWT_SECRET, {expiresIn: "1h"});
        
        //4.Save the token to the user document
        user.token = token;
        await user.save();

        //5.Send response
        res.status(200).json({message: "Login successful", token, user:{              
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
    } catch (error) {
        res.status(500).json({message: "Login Failed", error: error.message});
    }
};


//get user information
export const getUserInfo = async(req,res)=>{
    try {
        res.status(200).json({message: "User info fetched successfully", 
            user: req.user,                                           //this comes from the verifyToken middleware
        })
    } catch (error) {
        res.status(500).json({message: "Failed to fetch user Info"});
    }
};


//Logout user
export const logoutUser = async(req,res)=>{
    try {
        //Get the real user from DB using ID in token
        // console.log(req.user.userId);
        const user = await User.findById(req.user.userId);

        if(!user){
          return res.status(404).json({message: "User not found"});
        }
        
        //Clear token and save user
        user.token = "";
        await user.save();
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        res.status(500).json({message: "Logout failed", error: error.message});
    }
};