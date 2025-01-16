require("dotenv").config();
const fs = require("fs");
const pinataSDK = require("@pinata/sdk");
const File = require("../models/fileModel");

console.log("Starting the file upload process");

// Initialize Pinata SDK
const pinata = new pinataSDK(
  "3c2bc7f3f81e81f6981d",
  "88cbaa02bfc762acfffbd1462cf97b815e032e86560363d20fe7a36535ee7d0c"
);

// Upload a file
const uploadFile = async (req, res) => {
  try {
    console.log(req.user, 'adeidfgedg')
    const userId = req.user._id.toString(); // Assuming user ID is available from middleware
    console.log(userId, "Check in upload file");
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File received:", file);

    // Read the file into a buffer
    const fileBuffer = fs.readFileSync(file.path);
    console.log("File buffer created");

    // Create a readable stream from the buffer
    const stream = fs.createReadStream(file.path);

    // Upload file to Pinata

    console.log(userId, "dneqd");
    const options = {
      pinataMetadata: {
        name: file.originalname,
        keyvalues: {
          uploader: userId,
        },
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const ipfsResult = await pinata.pinFileToIPFS(stream, options);
    console.log("File uploaded to IPFS:", ipfsResult);

    // Save metadata to MongoDB
    const newFile = new File({
      filename: file.originalname,
      ipfsHash: ipfsResult.IpfsHash,
      uploader: userId,
    });

    await newFile.save();
    console.log("File metadata saved to MongoDB");

    // Delete local file
    fs.unlinkSync(file.path);
    console.log("Local file deleted");

    res.status(201).json({
      message: "File uploaded successfully",
      ipfsHash: ipfsResult.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsResult.IpfsHash}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};

// Get all files for a user
const getFiles = async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming user ID is available from middleware

    console.log(userId, 'yyyyyyyyyy')
    const files = await File.find({ uploader: userId });
    res.status(200).json(
      files.map((file) => ({
        filename: file.filename,
        ipfsHash: file.ipfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`,
        uploadDate: file.uploadDate,
      }))
    );
  } catch (error) {
    console.error("Error retrieving files:", error);
    res
      .status(500)
      .json({ message: "Error retrieving files", error: error.message });
  }
};

module.exports = {
  uploadFile,
  getFiles,
};
