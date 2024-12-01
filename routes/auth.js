const bcryptjs = require('bcryptjs');
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "dhruv$Rana";
const fetchuser=require('../middleware/fetchuser')

// Route 1. Create a user using POST "/api/auth", doesn't require authentication

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', "Enter a valid Email").isEmail(),
  body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  let success=false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success,errors: errors.array() });
  }
  const salt = await bcryptjs.genSalt(10)
  const secPass = await bcryptjs.hash(req.body.password, salt)
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    success=true;
    res.json({ success,authtoken });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ success,error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ success, error: 'Server error' });
  }
});



//Route 2.  Authenticate a user. Post:"api/auth/login". No login reqd.

router.post('/login', [
  body('email', "Enter a valid Email").isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success=false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({success,error:"Enter proper credentials to login"});
    }
    const passwordCompare = await bcryptjs.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({success,error:"Try logging with correct credentials"});
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    success=true
    res.json({success, authtoken });

  } catch (error) {

    res.status(500).json({success:success,error: 'Server error' });
  }
})

// Route 3. Get logged in user details: POST "api/auth/getuser". Login reqd 

router.post('/getuser',fetchuser,async (req, res) => {
try{
  userId=req.user.id;
  const user=await User.findById(userId).select("-password")
  res.send(user)
}catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
})

module.exports = router;

