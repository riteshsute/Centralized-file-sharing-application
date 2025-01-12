const fs = require('fs');
const { create } = require('ipfs-http-client');
const File = require('../models/fileModel');

console.log('Starting the file upload process');

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// Upload a file
const uploadFile = async (req, res) => {
  try {
    const userId = req.userId; // Assuming user ID is available from middleware
    console.log('chek in upload file')
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', file);

    // Read the file into a buffer
    const fileBuffer = fs.readFileSync(file.path);
    console.log('File buffer created');

    // Upload file to IPFS
    const ipfsResult = await ipfs.add(fileBuffer);
    console.log('File uploaded to IPFS:', ipfsResult);

    // Save metadata to MongoDB
    const newFile = new File({
      filename: file.originalname,
      ipfsHash: ipfsResult.path,
      uploader: userId,
    });

    await newFile.save();
    console.log('File metadata saved to MongoDB');

    // Delete local file
    fs.unlinkSync(file.path);
    console.log('Local file deleted');

    res.status(201).json({
      message: 'File uploaded successfully',
      ipfsHash: ipfsResult.path,
      ipfsUrl: `https://ipfs.infura.io/ipfs/${ipfsResult.path}`,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Get all files for a user
const getFiles = async (req, res) => {
  try {
    const userId = req.userId; // Assuming user ID is available from middleware

    const files = await File.find({ uploader: userId });
    res.status(200).json(files.map(file => ({
      filename: file.filename,
      ipfsHash: file.ipfsHash,
      ipfsUrl: `https://ipfs.infura.io/ipfs/${file.ipfsHash}`,
      uploadDate: file.uploadDate,
    })));
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ message: 'Error retrieving files', error: error.message });
  }
};

module.exports = {
  uploadFile,
  getFiles
};
