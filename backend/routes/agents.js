const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const Agent = require('../models/Agent');

// Create agent (admin only - simple check)
router.post('/', auth, async (req,res)=>{
  try{
    if(req.user.role !== 'admin') return res.status(403).json({message:'Forbidden'});
    const {name,email,mobile,password} = req.body;
    if(!email || !password) return res.status(400).json({message:'Email and password required'});
    const hashed = await bcrypt.hash(password,10);
    const agent = new Agent({name,email,mobile,password:hashed});
    await agent.save();
    res.json({message:'Agent created', agent});
  }catch(err){ res.status(500).json({message:err.message})}
});

// List agents
router.get('/', auth, async (req,res)=>{
  const agents = await Agent.find().select('-password');
  res.json({agents});
});

module.exports = router;
