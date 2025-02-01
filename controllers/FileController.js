require("dotenv").config();
const fs = require("fs");
const pinataSDK = require("@pinata/sdk");
const File = require("../models/fileModel");
const nodemailer =  require('nodemailer');

console.log("Starting the file upload process");

// Initialize Pinata SDK
const pinata = new pinataSDK(
  "3c2bc7f3f81e81f6981d",
  "88cbaa02bfc762acfffbd1462cf97b815e032e86560363d20fe7a36535ee7d0c"
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'suteritesh@gmail.com',
    pass: 'dlah jfji dlkq aaff',
  },
});


// const sendFileLinkEmail = async (recipientEmail, fileName, ipfsHash) => {
//   const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
//   const mailOptions = {
//     from: 'suteritesh@gmail.com',
//     to: recipientEmail,
//     subject: 'Here is your file',
//     html: `<p>You can download your file <strong>${fileName}</strong> from the following link:</p>
//            <p><a href="${ipfsUrl}">${ipfsUrl}</a></p>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };



const uploadFile = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { file } = req;
    const { recipientEmail } = req.body; 

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the file into a buffer
    const fileBuffer = fs.readFileSync(file.path);

    // Create a readable stream from the buffer
    const stream = fs.createReadStream(file.path);

    // Upload file to Pinata
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

    // Save metadata to MongoDB
    const newFile = new File({
      filename: file.originalname,
      ipfsHash: ipfsResult.IpfsHash,
      uploader: userId,
    });

    await newFile.save();

    // Delete local file
    fs.unlinkSync(file.path);

    // Send email with the IPFS file link
    if (recipientEmail) {
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsResult.IpfsHash}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'File Upload Successful',
        html: `<p>Your file <strong>${file.originalname}</strong> has been uploaded successfully.</p>
               <p>You can access it here: <a href="${ipfsUrl}">${ipfsUrl}</a></p>`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({
      message: 'File uploaded and email sent successfully',
      ipfsHash: ipfsResult.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsResult.IpfsHash}`,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};



const getFiles = async (req, res) => {
  try {
    const userId = req.body.userId; //  user ID is available from middleware

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
