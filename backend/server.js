require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/book-call', bookingRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Team Portfolio API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
