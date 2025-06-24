const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const layoutRoutes  = require('./routes/layoutRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected (Local via Compass)'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('RoomiPlan backend connected to MongoDB (local)!');
});


app.use('/api/layout', layoutRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
