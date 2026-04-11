import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// // Routes
// import authRoutes from './routes/auth.routes.js';
// import validatorRoutes from './routes/validator.routes.js';
// import trendsRoutes from './routes/trends.routes.js';
// import chatbotRoutes from './routes/chatbot.routes.js';
// import historyRoutes from './routes/history.routes.js';
// import recommendationsRoutes from './routes/recommendations.routes.js';

// Middleware
// import errorHandler from './middleware/errorHandler.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/validate', validatorRoutes);
// app.use('/api/trends', trendsRoutes);
// app.use('/api/chat', chatbotRoutes);
// app.use('/api/history', historyRoutes);
// app.use('/api/recommendations', recommendationsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Viral Content Validator API is running');
});

// Error Handler (always last)
// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});