
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express(); 
app.use(cors({ origin:"*" }));
app.use(express.json()); 



// ייבוא ראוטים
const Owner = require('./routes/owner');
const Supplier = require('./routes/supplier');
const Product=require('./routes/product');
const Login = require('./routes/login');
const Orders=require('./routes/order');

// שימוש בראוטים
app.use('/owner', Owner);
app.use('/supplier', Supplier);
app.use('/product',Product);
app.use('/login', Login); 
app.use('/orders',Orders);


const PORT = 5000;

mongoose
  .connect(process.env.CONACTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error.message));
