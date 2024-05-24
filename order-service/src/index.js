const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use('/api', orderRoutes);

mongoose.connect('mongodb://localhost:27017/orders', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});
