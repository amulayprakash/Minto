const mongoose = require("mongoose");
const waitlistSchema = new mongoose.Schema({
  collectionID:{
    type:String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isLive: {
    type: Boolean,
  }, 
  name: {
    type: Boolean,
  }, 
  email: {
    type: Boolean,
  }, 
  phoneNumber: {
    type: Boolean,
  },
  termsAndConditions: {
    type: String,
  }
});

module.exports = mongoose.model("Waitlist", waitlistSchema);
