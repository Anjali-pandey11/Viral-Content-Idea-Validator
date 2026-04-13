import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';

const protect = asyncHandler(async (req, res, next) => {
   let token;

   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
     try {

       // Bearer TOKEN → sirf TOKEN nikalo
      token = req.headers.authorization.split(' ')[1];

       // Token verify karo
      const decode = jwt.verify(token, process.env.JWT_SECRET)

      // User ko request mein attach karo (password ke bina)
      const user = await User.findById(decode.id).select('-password');

      // Agar user nahi mila database mein
      if (!user) {
        res.status(401);
        throw new Error('User not found, not authorized');
      }

      // User mil gaya → request mein attach karo
      req.user = user;

    return  next();


     } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
     }
   }

   if(!token){
    res.status(401);
    throw new Error('Not authorized, no token');
   }
  
})

export default protect;