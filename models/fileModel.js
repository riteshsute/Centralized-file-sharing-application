const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const fileSchema = new Schema({
  filename: { 
    type: String, 
    required: true 
    },
  ipfsHash: { 
    type: String, 
    required: true 
    },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
    },
});

module.exports = mongoose.model("File", fileSchema);
