import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Database/dbConfig.js";
import userRoutes from "./Routes/user.router.js"


dotenv.config();

const app = express();

//Middleware
app.use(cors());

app.use(express.json());         //To parse json request bodies

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/users", userRoutes);


app.get("/", (req,res)=>{
res.status(200).send("Welcome to the User Auth API 🔐");
});

//Start server
const port = process.env.PORT || 4000;


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})