const User = require("../model/authModel");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "password", {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    console.log("Register called!")
    console.log(req.body)
    const { email, username, name, password } = req.body;

    console.log(email)
    console.log(username)
    console.log(name)
    console.log(password)

    const user = new User({ email,username,name,password});
    if (req.files && req.files.photo) {
      const photo = req.files.photo;
      const photoPath = `/uploads/${username}_photo.jpeg`;
      await photo.mv(`.${photoPath}`);
      user.photo = photoPath;
    }
    await user.save();
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    }); 

    res.status(201).json({ user: user, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
}; 

module.exports.login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.login(email, username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

module.exports.update = async (req, res) => {
  console.log(req.body);
  console.log(req.file); 
  const { email, username, password } = req.body;

  try {
    let user = await User.findOne({username});

    if(!user) return res.status(400).json({ error: "User not found" });
    if (email) user.email = email; 
    if (username) user.username = username; 
    if (password) user.password = password; 
    if (req.file) {
      const photoURL = req.file.path;
      user.photo = photoURL;
    } 
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};