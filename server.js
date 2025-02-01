require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Allow frontend-backend communication

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/urls', urlRoutes); // URL management routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));