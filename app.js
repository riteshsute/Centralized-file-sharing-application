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

const userRoutes = require('./routes/userRoute');
// const expensesRoute = require('./Routes/expenses');


app.use(userRoutes); 
// app.use(expensesRoute);



mongoose
  .connect(
  'mongodb+srv://suteritesh:%40Ritesh123@cluster0.dnq92.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
)
.then(() => {
    app.listen(7000); 
    console.log('server connected')
})
.catch(err => { 
    console.log(err)
})
 

