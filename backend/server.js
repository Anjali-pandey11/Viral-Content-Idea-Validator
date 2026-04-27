
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import validatorRoutes from './routes/validator.routes.js';
import trendsRoutes from './routes/trends.routes.js';
import historyRoutes from './routes/history.routes.js';



// Middleware
import errorHandler from './middleware/errorHandler.middleware.js';



const app = express();
const PORT = process.env.PORT || 5000;




// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/validate', validatorRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/history', historyRoutes);


// Health check
app.get('/', (req, res) => {
  res.send('Viral Content Validator API is running');
});

// Error Handler (always last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});