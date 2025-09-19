const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Simple register (for admin seeding/testing)
router.post('/register', async (req,res)=>{
  try{
    const {name,email,password,role} = req.body;
    if(!email || !password) return res.status(400).json({message:'Email and password required'});
    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({message:'User exists'});
    const hashed = await bcrypt.hash(password,10);
    const user = new User({name,email,password:hashed, role: role || 'admin'});
    await user.save();
    res.json({message:'User created'});
  }catch(err){ res.status(500).json({message:err.message})}
});

// Login
router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({id:user._id, email:user.email, role:user.role}, process.env.JWT_SECRET || 'secret', {expiresIn:'8h'});
    res.json({token, user:{email:user.email, name:user.name, role:user.role}});
  }catch(err){ res.status(500).json({message:err.message})}
});

module.exports = router;
