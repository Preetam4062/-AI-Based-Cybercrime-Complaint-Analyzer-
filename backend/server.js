require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Route files
const auth = require('./routes/authRoutes');
const complaints = require('./routes/complaintRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/complaints', complaints);

// Health Route
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'CyberSense Core Online' }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[SERVER] CyberSense API running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
