import mongoose from "mongoose";


//Create user schema
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,             //no duplicate emails
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        default: "user",        //optional buy useful
    },
    token: {
        type: String,            //to store JWT
    },
},{timestamps: true});             //adds createdAt and updatedAt


//Create Model
const User = mongoose.model("User", userSchema);


export default User;