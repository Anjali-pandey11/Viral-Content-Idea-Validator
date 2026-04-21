import express from 'express';
import { getMe, loginUser, registerUser, updateProfile } from '../controllers/auth.controller.js';


 const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/me",getMe);
router.put("/update",updateProfile);


export default router;

