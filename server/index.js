const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require('body-parser')
const Collection = require("./model/collectionModel");
const Presalelist = require("./model/preSaleListModel");
const Waitlist = require("./model/waitlistModel");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.warn("Connected");
  });

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://minto-dev.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.post("/createPresalelistEntry", (req, res) => {
  const { collectionID } = req.body;
  const { addedVia } = req.body;
  const { walletAddress } = req.body;
  const { quantity } = req.body;

  const document = new Presalelist({
    collectionID: collectionID,
    addedVia: addedVia,
    walletAddress: walletAddress,
    quantity: quantity,
  });

  document.save((err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log("New Document Saved");
      res.sendStatus(200);
    }
  });
});

app.get("/viewPreSaleListbyCollectionID", async (req, res) => {
  try {
    const collectionID = req.query.collectionID;
    console.log(collectionID);
    const doc = await Presalelist.find({ collectionID: collectionID });
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/createWaitlist", (req, res) => {
  const { collectionID } = req.body;
  const { name } = req.body;
  const { email } = req.body;
  const { phoneNumber } = req.body;
  const { termsAndConditions } = req.body;

  const document = new Waitlist({
    collectionID: collectionID,
    isLive: true,
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    termsAndConditions: termsAndConditions,
  });

  document.save((err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log("New Document Saved");
      res.sendStatus(200);
    }
  });
});

app.post(
  "/createCollection",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  (req, res) => {
    const id = uuidv4();
    const { username } = req.body;
    const { name } = req.body;
    const { symbol } = req.body;
    const { url } = req.body;
    const { primary } = req.body;
    const { secondary } = req.body;
    const { rpercent } = req.body;
    const { description } = req.body;
    const { network } = req.body;

    const document = new Collection({
      username: username,
      collectionID: id,
      name: name,
      symbol: symbol,
      url: url,
      primary: primary,
      secondary: secondary,
      rpercent: rpercent,
      image: req.files["image"][0].filename,
      banner: req.files["banner"][0].filename,
      description: description,
      network: network,
    });

    document.save((err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log("New Document Saved");
        res.sendStatus(200);
      }
    });
  }
);

app.get("/viewCollections", async (req, res) => {
  try {
    const username = req.query.username;
    console.log(username);
    const docs = await Collection.find({ username: username });
    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/viewCollectionsbyID", async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const doc = await Collection.find({ collectionID: id });
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.delete("/deleteCollection", async (req, res) => {
  const { id } = req.query;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid ID");
    return res.status(400).send("Invalid ID");
  }

  try {
    const result = await Collection.findByIdAndDelete(id);

    if (!result) {
      console.log("Document not found");
      return res.status(404).send("Document not found");
    }

    res.send("Document deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.put("/updateCollection", async (req, res) => {
  try {
    const id = req.query.collectionID;
    const address = req.query.address;
    const doc = await Collection.findOneAndUpdate(
      { collectionID: id },
      { isDeployed: true, deployedAddress: address },
      { new: true }
    );
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.put("/updateCollectionPreSale", async (req, res) => {
  try {
    const id = req.query.collectionID;
    const preSaleLive = req.query.preSaleLive;
    const doc = await Collection.findOneAndUpdate(
      { collectionID: id },
      { preSaleLive: preSaleLive },
      { new: true }
    );
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.put("/updateCollectionPublicSale", async (req, res) => {
  try {
    const id = req.query.collectionID;
    const publicSaleLive = req.query.publicSaleLive;
    console.log(publicSaleLive);
    const doc = await Collection.findOneAndUpdate(
      { collectionID: id },
      { publicSaleLive: publicSaleLive },
      { new: true }
    );
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.put("/updateCollectionTotalWeiEarned", async (req, res) => {
  try {
    const id = req.query.collectionID;
    const totalWeiEarned = req.query.totalWeiEarned;
    const doc = await Collection.findOneAndUpdate(
      { collectionID: id },
      { $inc: { totalWeiEarned: totalWeiEarned } },
      { new: true }
    );
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.put(
  "/updateCollectionPreReveal",
  upload.fields([{ name: "preRevealImage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const id = req.body.collectionID;
      const preRevealName = req.body.preRevealName;
      const preRevealDescription = req.body.preRevealDescription;

      const doc = await Collection.findOneAndUpdate(
        { collectionID: id },
        {
          preRevealName: preRevealName,
          preRevealDescription: preRevealDescription,
          preRevealImage: req.files["preRevealImage"][0].filename,
        },
        { new: true }
      );
      res.json(doc);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

app.listen(4000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started Successfully at PORT 4000.");
  }
});

app.use("/", authRoutes);
// https://minto-dev.onrender.com/register