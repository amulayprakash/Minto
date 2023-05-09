const mongoose = require("mongoose");
const presalelistSchema = new mongoose.Schema({
//   collectionRef:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Collections"                         
//   }, 
  collectionID:{
    type:String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  addedVia: {
    type: String,
  }, 
  walletAddress: {
    type: String,
  }, 
  quantity: {
    type: Number,
  }
});

module.exports = mongoose.model("Presalelist", presalelistSchema);
