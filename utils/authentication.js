
const jwt = require('jsonwebtoken');
const User  = require('../models/user');


const autheticate = (req, res, next) => {
    try{
    const token = req.header('Authorization')
    console.log(process.env.TOKEN_SECRET)

    const user = jwt.verify(token, 'jsbdgd89072o83hliebwod8hd'); 
    
    User.findById(user.userId).then(user => {
        req.user = user;
        next()
    })
    .catch(err => { throw new Error(err)});
  } catch(err){
    console.log(err);
    return res.status(401).json({ success: false })
  }
}
 
module.exports = {
    autheticate
}



// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// module.exports = { protect };
