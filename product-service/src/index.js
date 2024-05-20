const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.use('/api', productRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
});

// Start the gRPC server
require('./grpc/server');
