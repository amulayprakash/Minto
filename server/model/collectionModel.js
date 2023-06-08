const mongoose = require("mongoose");
const collectionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
  },
  collectionID: {
    type: String,
    required: [true, "CollectionID is Required"],
  },
  name: {
    type: String,
    // default:"Blue Chips Collection"
    required: [true, "Collection Name is Required"],
  },
  symbol: {
    type: String,
    // default:"BCCKI"
    required: [true, "Collection Symbol is Required"],
  }, 
  url: {
    type: String,
    // default:"bluechips/api/collection"
  }, 
  primary: {
    type: String,
    // default:"0x5daCcC5653C7D640EbB2a1EdAeB91305842a8125"
    required: [true, "Wallet address to receive primary sales is Required"],
  },
  secondary: {
    type: String,
    // default:"0x5daCcC5653C7D640EbB2a1EdAeB91305842a8125"
    required: [true, "Wallet Address to receive secondary sales is Required"],
  }, 
  rpercent: {
    type: Number,
    default:"5"
  }, 
  image:{
    type: String,
    default: "image-1680386360842.jpg",
  },
  banner:{
    type: String,
    default: "banner-1683577537427.jpg",
  }, 
  preRevealImage:{
    type: String,
    // default: "preRevealImage-1683616185834.gif",
  }, 
  description: {
    type: String,
    default:"This is a Gaming art collection of total supply 1000 NFTs"
    // required: [true, "Collection description is Required"],
  },
  isDeployed:{
    type:Boolean,
    default:false
  },
  totalWeiEarned:{
    type:Number,
    default:0
  },
  preSaleLive:{
    type:Boolean,
    default:false
  },
  publicSaleLive:{
    type:Boolean,
    default:false
  },
  deployedAddress:{
    type:String,
    default:""
  },
  preRevealName:{
    type:String,
    default:"Collection Name"
  },
  preRevealDescription:{
    type:String,
    default:"Collection Description"
  },
  waitlistlive:{
    type:Boolean,
    default:false
  },
  network: {
    type: String,
    enum: ['Polygon Testnet','Ethereum Mainnet','Polygon Mainnet','Arbitrum'],
    default: 'Polygon Testnet'
  }
});

module.exports = mongoose.model("Collections", collectionSchema);
