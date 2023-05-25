const User = require("../model/authModel");
const jwt = require("jsonwebtoken");

module.exports.verify = (req, res, next) => {
  const token = req.cookies.jwt || req.body.token;

  if (token) {
    jwt.verify(token, "password", async (err, decodedToken) => {
      if (err) {
        return res.json({ status: false });
      } else {
        const user = await User.findById(decodedToken.id);
        req.userData = user;
        next();
      }
    });
  } else {
    return res.json({ status: false });
  }
};
