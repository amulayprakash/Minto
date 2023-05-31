const multer = require("multer");
const router = require("express").Router();
const returnJsonController = require("./../controllers/jsonReturnController");
const { verify } = require("./../middlewares/verify");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "json-uploads/");
  },
  filename: function (req, file, cb) {
    const filenameJson = `${req.params.filenm}.json`;
    cb(null, filenameJson);
  },
});
const upload = multer({ storage: storage });

router.get("/:collectionId/:index", returnJsonController.getJson);
router.get("/:id", returnJsonController.getAllNftInfo);
router.get("/placeholder/json/:id", returnJsonController.getPlaceholderJson);

router.post(
  "/:filenm",
  verify,
  upload.single("file"),
  returnJsonController.saveJson
);
router.post(
  "/update/revealstatus",
  verify,
  returnJsonController.updateRevealStatus
);

router.post(
  "/placeholder/:filenm",
  // verify,
  upload.single("file"),
  returnJsonController.savePlaceholderJson
);

module.exports = router;
