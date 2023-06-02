const { register, login, update } = require("../controllers/authControllers");
const { authUser,checkUser } = require("../middlewares/authMiddleware");
const multer  = require('multer')
const router = require("express").Router();
const upload = multer({ dest: 'uploads/' })

router.post("/", authUser); 
router.post("/register", register);
// router.post("/update",upload.single('image'), update);
router.post("/update",checkUser, update);
router.post("/login", login); 

module.exports = router;
