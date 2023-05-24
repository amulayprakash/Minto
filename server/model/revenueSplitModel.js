const mongoose = require("mongoose");
const revenueSplitModel = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
  },
  name:{
    type:String
  },  
  addresses:{
    type:[String]
  },
  splits:{
    type:[Number]
  },
  isDeployed:{
    type:Boolean,
    default:false
  },
  deployedAddress:{
    type:String,
    default:""
  },
  network: {
    type: String,
    enum: ['Polygon Testnet','Ethereum Mainnet','Polygon Mainnet','Arbitrum'],
    default: 'Polygon Testnet'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("RevenueSplit", revenueSplitModel);
