const express = require('express');
const multer = require('multer');
const { uploadFile, getFiles } = require('../controllers/FileController');
const authenticate = require('../utils/authentication'); // Middleware to authenticate JWT

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

console.log('authenticate type:', typeof authenticate);
console.log('uploadFile type:', typeof uploadFile);


router.post('/upload', authenticate, upload.single('file'), uploadFile);

router.get('/files', authenticate,  getFiles);

module.exports = router; 
