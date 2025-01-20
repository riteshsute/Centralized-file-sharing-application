const User = require('../models/userModel');
const Bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const signUpUser = ( async (req, res) => {
    
    const { name, email, password} = req.body;
    console.log(req.body)
    try{
    const existingUser = await User.findOne({ where: { email: email } });
 
      if (existingUser) { 
        return res.status(400).json({
          error: 'User already exists'
        });
      } 
      Bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          throw new Error('Something went wrong');
        }
  
        const user = new User({
          name: name,
          email: email,
          password: hash
        });
  
        await user.save();
          res.status(201).json({
          message: 'User created successfully'
        })
      });
    } catch(err) {
      res.status(500).json(err, 'in post error')
     }
  })


  const generateAccessToken = (id, name ) => {
    return jwt.sign({ userId: id, name: name }, 'jsbdgd89072o83hliebwod8hd');
  };



const loginUser =  ( async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body, 'in login fun');

    const user = await User.findOne({ email: email });

    // console.log(user)
    if (!user) { 
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        throw new Error('Something Went Wrong');
      }
 
      if (result === true) {
        const token = generateAccessToken(user._id, user.name);
        res.status(200).json({ success: true, message: 'User logged in successfully', token: token });
      } else {
        return res.status(400).json({ success: false, message: 'Password not matched' });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
  })
  

  module.exports = {
    signUpUser,
    generateAccessToken,
    loginUser
  }