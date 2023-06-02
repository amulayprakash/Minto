const User = require("../model/authModel");
const jwt = require("jsonwebtoken");

module.exports.authUser = (req, res, next) => {
  const token = req.cookies.jwt || req.body.token;
  if (token) {
    jwt.verify(token, "password", async (err, decodedToken) => {
      if (err) {
        res.json({status:false});
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        if (user){
          res.json({status:true,user:user})
          next();
        } 
        else {
          res.json({status:false});
          next();
        }
      }
    });
  } else {
    res.json({status:false});
    next();
  }
};

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt || req.body.token;;
  if (token) {
    jwt.verify(token, 'password', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
