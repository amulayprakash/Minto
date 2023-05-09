const { register, login, update } = require("../controllers/authControllers");
const { checkUser } = require("../middlewares/authMiddleware");
const multer  = require('multer')
const router = require("express").Router();
const upload = multer({ dest: 'uploads/' })

router.post("/", checkUser); 
router.post("/register", register);
router.post("/update",upload.single('image'), update);
router.post("/login", login); 

module.exports = router;
