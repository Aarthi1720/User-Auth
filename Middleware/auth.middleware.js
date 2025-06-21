import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const verifyToken = (req,res,next)=>{
   try {
     //Get token from Authorization header
    const authHeader = req.headers.authorization; //example: user comes to the gate with token

    //check if token exists and starts with "Bearer"
    if(!authHeader || !authHeader.startsWith("Bearer ")){                                                                    //Guard checks if token is really there and says "Bearer ID"
        return res.status(401).json({message: "Access denied. No token provided."});                                        //if there is no token or token does not start with "Bearer" then the user is not allowed in
    }
   //Extract token
    const token = authHeader.split(" ")[1];                                                                                 //Guard removes the word "Bearer" and keeps just the token (we split the string into two parts: "Bearer" and the actual token. we only want the token part -> that's at position [1])

    //verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);                                                             //this checks if the token is valid, using the secret key we used when creating the token. If valid, it gives back the decoded user info like userID, email, role etc.

    //Attach user data to request object
    req.user = decoded;                                                                                                    //we store the user info in req.user so that next function (or controller) can use it.
    // console.log(req.user);
    //Proceed to the next middleware or controller(calls next() to allow the protected route to run)
    next();                                                                                                               //id valid, guard lets user in (calls next());           if everything is ok this tells the app: All clear, you can now go to the protected router.

   } catch (error) {
    res.status(401).json({message: "Invalid or expired token"});                                                             //if not valid shows error and blocks the way
   }

};