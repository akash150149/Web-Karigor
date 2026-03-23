require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const contactRoutes = require('./routes/contactRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/book-call', bookingRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Web-Karigor API is running' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
