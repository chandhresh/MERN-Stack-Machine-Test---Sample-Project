require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const uploadRoutes = require('./routes/upload');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_task_db';

mongoose.connect(MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log('Server running on port', PORT));
  })
  .catch(err => console.error('DB connection error', err));
