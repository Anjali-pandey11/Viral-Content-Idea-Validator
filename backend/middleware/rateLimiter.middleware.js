import rateLimit from 'express-rate-limit';

//General API limit
export const generalLimiter = rateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max:100, // 100 requests per 15 minutes
  message:{
    success:false,
    statusCode:429,
    message:'Too many requests, please try again after 15 minutes'
  },
})


// Claude API limit - strict due to expensive calls 
export const claudeLimiter = rateLimit({
  windowMs:60*60*1000, // 1 hour
  max:20, // 20 requests per hour
  message:{
    success: false,
    statusCode:429,
    message:'AI request limit reached, please try again after 1 hour',
  }
})



// Auth limit - brute force attack roken ke liye
export const authLimiter = rateLimit({
   windowMs: 15*60*1000, // 15 minutes
   max:10, // 10 requests per 15 minutes
   message:{
    success:false,
    statusCode:429,
    message:'Too many login attempts, please try again after 15 minutes',
   },
});