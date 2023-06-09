const fs = require("fs");
const NFTRevealModel = require("./../model/NFTRevealModel");
const Collection = require("./../model/collectionModel");
const path = require("path");

module.exports.saveJson = async (req, res) => {
  try {
    const { collectionID } = req.body;
    const { filenm } = req.params;

    let data = fs.readFileSync(req.file.path, "utf-8");
    data = JSON.parse(data);

    if (!data["collection"]) {
      return res
        .status(404)
        .json({ ok: false, msg: "The file does not contain collection array" });
    }

    const size = data["collection"].length;
    const initArray = new Array(size).fill(0);

    let currReveal;
    try {
      currReveal = await NFTRevealModel.find({ collectionId: filenm });
    } catch (err) {
      return res
        .status(403)
        .json({ ok: false, msg: "Error finding the collection reveal status" });
    }

    if (currReveal.length == 0) {
      const newReveal = new NFTRevealModel({
        revealArray: initArray,
        collectionId: filenm,
        dropid: collectionID,
        size,
      });
      await newReveal.save();
    } else {
      await NFTRevealModel.findOneAndUpdate(
        { collectionId: filenm },
        { revealArray: initArray, size }
      );
    }

    const finalData = data["collection"].map((curr) => {
      return {
        name: curr.name,
        reveal: 0,
      };
    });

    return res
      .status(200)
      .json({ ok: true, msg: "the file saved successfully", data: finalData });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ ok: false, msg: err?.message || "Something went wrong!" });
  }
};

module.exports.getAllNftInfo = async (req, res) => {
  try {
    const { id } = req.params;

    let data;
    try {
      data = fs.readFileSync(
        path.resolve(__dirname, `../json-uploads/${id}.json`),
        "utf-8"
      );
      data = JSON.parse(data);
    } catch (err) {
      return res.status(403).json({ ok: false, msg: "Cannot read the file" });
    }

    let revealStatus;

    try {
      revealStatus = await NFTRevealModel.find({ collectionId: id });
    } catch (err) {
      return res
        .status(403)
        .json({ ok: false, msg: "Error finding the collection reveal status" });
    }

    if (revealStatus.length == 0) {
      return res.status(403).json({ ok: false, msg: "No file with this id" });
    }

    const resultData = revealStatus[0].revealArray.map((curr, i) => {
      const stl = data["collection"][i];

      return {
        name: stl.name,
        reveal: curr,
      };
    });

    res.status(200).json({ ok: true, res: { resultData } });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ ok: false, msg: err?.message || "Something went wrong!" });
  }
};

module.exports.getJson = async (req, res) => {
  try {
    const { collectionId, index } = req.params;

    let data;
    try {
      data = fs.readFileSync(
        path.resolve(__dirname, `../json-uploads/${collectionId}.json`),
        "utf-8"
      );
      data = JSON.parse(data);
    } catch (err) {
      return res.status(403).json({ ok: false, msg: "Cannot read the file" });
    }

    let revealStatus;
    try {
      revealStatus = await NFTRevealModel.find({ collectionId: collectionId });
    } catch (err) {
      return res
        .status(403)
        .json({ ok: false, msg: "Error finding the collection reveal status" });
    }

    if (revealStatus[0].revealArray[Number(index) - 1] === 1) {
      return res.status(200).json(data["collection"][Number(index) - 1]);
    } else {
      let unreveal = null;
      try {
        // unreveal = fs.readFileSync(
        //   path.resolve(
        //     __dirname,
        //     `../json-uploads/${collectionId}-placeholder.json`
        //   ),
        //   "utf-8"
        // );
        // unreveal = JSON.parse(unreveal);
        unreveal = await Collection.find({ _id: collectionId });
        if (unreveal.length !== 1) throw Error();
      } catch (err) {
        console.log(err);
        return res.status(403).json({ ok: false, msg: "Something went wrong" });
      }

      if (!unreveal[0].preRevealImage) {
        return res.status(200).json({ name: "", image: null });
      } else {
        return res.status(200).json({
          name: unreveal[0].preRevealName,
          description: unreveal[0].preRevealDescription,
          image: `http://localhost:4000/api/uploads/${unreveal[0].preRevealImage}`,
          // image: `http://3.136.161.65/api/uploads/${unreveal[0].preRevealImage}`,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ ok: false, msg: err?.message || "Something went wrong!" });
  }
};

module.exports.updateRevealStatus = async (req, res) => {
  try {
    let { collectionId, startIndex, endIndex } = req.body;
    startIndex = Number(startIndex);
    endIndex = Number(endIndex);

    let revealStatus;
    try {
      revealStatus = await NFTRevealModel.find({ collectionId: collectionId });
    } catch (err) {
      return res
        .status(403)
        .json({ ok: false, msg: "Error finding the collection reveal status" });
    }

    if (revealStatus.length == 0) {
      return res.status(403).json({ ok: false, msg: "No file with this id" });
    }

    if (startIndex < 0 || endIndex >= revealStatus[0].size) {
      return res
        .status(403)
        .json({ ok: false, msg: "Invalid indexes passed!" });
    }
    const newRevealArray = revealStatus[0].revealArray;

    for (let i = 0; i < newRevealArray.length; i++) {
      if (i >= startIndex && i <= endIndex) {
        newRevealArray[i] = 1;
      } else {
        newRevealArray[i] = 0;
      }
    }

    await NFTRevealModel.findOneAndUpdate(
      { collectionId: collectionId },
      { revealArray: newRevealArray }
    );

    return res
      .status(200)
      .json({ ok: true, msg: "the file saved successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ ok: false, msg: err?.message || "Something went wrong!" });
  }
};

module.exports.savePlaceholderJson = async (req, res) => {
  try {
    let data = fs.readFileSync(req.file.path, "utf-8");
    data = JSON.parse(data);

    if (!data.name || !data.image) {
      return res
        .status(404)
        .json({ ok: false, msg: "The file format of json is not correct" });
    }

    res.json({ ok: true, msg: "Placeholder saved successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ ok: false, msg: err?.message || "Something went wrong!" });
  }
};

module.exports.getPlaceholderJson = async (req, res) => {
  try {
    const { id } = req.params;

    let data;
    try {
      data = fs.readFileSync(
        path.resolve(__dirname, `../json-uploads/${id}-placeholder.json`),
        "utf-8"
      );
      data = JSON.parse(data);
    } catch (err) {
      return res.json({ ok: false, msg: "Cannot read the file" });
    }

    res.status(200).json({ ok: true, data });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ ok: false, msg: err?.message || "Something went wrong!" });
  }
};
