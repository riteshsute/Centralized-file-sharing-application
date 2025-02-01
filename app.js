const path = require('path');

const express = require('express');

const fs = require('fs')

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const app = express()

const cors = require('cors') 

app.use(cors());
 
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoute');
const fileRoutes = require('./routes/fileRoute');

app.use('/user', userRoutes); 
app.use('/api/files', fileRoutes);



mongoose
  .connect(
  'mongodb+srv://suteritesh:%40Ritesh123@cluster0.dnq92.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
)
.then(() => {
    app.listen(7000); 
    console.log('server running on 7000');
})
.catch(err => { 
    console.log(err)
})
 

