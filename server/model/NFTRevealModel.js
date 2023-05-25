const mongoose = require("mongoose");

const nftRevealSchema = new mongoose.Schema({
  revealArray: { type: Array, default: [] },
  collectionId: { type: String, required: true },
  dropid: { type: String },
  size: { type: Number },
});

module.exports = mongoose.model("NFTReveal", nftRevealSchema);
