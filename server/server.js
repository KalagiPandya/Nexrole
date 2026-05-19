const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'NexRole API is running!' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected!');
    app.listen(process.env.PORT, () => {
      console.log('Server running on port ' + process.env.PORT);
    });
  })
  .catch(err => console.log('MongoDB Error:', err));