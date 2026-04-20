import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    niche: {
      type: String,
      enum: ['Fitness', 'Tech', 'Finance', 'Lifestyle', 'Education', 'Entertainment', 'Other'],
      default: 'Other',
    },
    platform: {
      type: [String],
      enum: ['Instagram', 'YouTube', 'LinkedIn', 'Twitter/X'],
      default: ['Instagram'],
    },
  },
  { timestamps: true }
);


const User = mongoose.model('User', userSchema);

export default User;


