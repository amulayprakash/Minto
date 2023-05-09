const Collection = require("../model/collectionModel");

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


module.exports.createCollection = async (req, res, next) => {
    try {
      console.log("CreateCollection called!")
      // const { username, name, symbol, url,primary,secondary,rpercent,description } = req.body;
      // const collection = new Collection({ username, name, symbol, url,primary,secondary,rpercent,description});
      // if (req.files && req.files.image && req.files.banner) {
      //   const image = req.files.image;
      //   const banner = req.files.banner;
      //   const imagePath = `/uploads/${username}_photo.jpeg`;
      //   await photo.mv(`.${photoPath}`);
      //   user.photo = photoPath;
      // }
      // await user.save();
      // const token = createToken(user._id);
  
      // res.cookie("jwt", token, {
      //   withCredentials: true,
      //   httpOnly: false,
      //   maxAge: maxAge * 1000,
      // }); 
  
      // res.status(201).json({ user: user, created: true });
    } catch (err) {
      console.log(err);
      const errors = handleErrors(err);
      res.json({ errors, created: false });
    }
  }; 
  