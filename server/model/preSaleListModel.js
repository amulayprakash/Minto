const mongoose = require("mongoose");
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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
    default: (new Date()).toLocaleDateString("en-US", options)
  },
  addedVia: {
    type: String,
  }, 
  walletAddress: {
    type: String,
  }, 
  quantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("Presalelist", presalelistSchema);
