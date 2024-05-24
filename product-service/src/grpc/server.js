// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const Product = require('../models/product');
// require('dotenv').config();

// const packageDefinition = protoLoader.loadSync(__dirname + '/product.proto', {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// });
// const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// const server = new grpc.Server();

// server.addService(productProto.ProductService.service, {
//   UpdateProductQuantity: async (call, callback) => {
//     const { product_id, quantity } = call.request;
//     try {
//       const product = await Product.findById(product_id);
//       if (product) {
//         product.quantity -= quantity;
//         await product.save();
//         callback(null, { success: true, message: 'Product quantity updated successfully' });
//       } else {
//         callback(null, { success: false, message: 'Product not found' });
//       }
//     } catch (error) {
//       callback(error);
//     }
//   }
// });

// const port = process.env.GRPC_PORT || 50051;
// server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
//   console.log(`gRPC server running at http://0.0.0.0:${port}`);
//   server.start();
// });

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Product = require('../models/product');
require('dotenv').config();

const packageDefinition = protoLoader.loadSync(__dirname + '/product.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const server = new grpc.Server();

server.addService(productProto.ProductService.service, {
  UpdateProductQuantity: (call, callback) => {
    const { product_id, quantity } = call.request;
    Product.findById(product_id, (err, product) => {
      if (err || !product) {
        return callback(null, { success: false, message: 'Product not found' });
      }
      product.quantity -= quantity;
      product.save((err) => {
        if (err) {
          return callback(null, { success: false, message: 'Failed to update product quantity' });
        }
        callback(null, { success: true, message: 'Product quantity updated', product_id: product._id.toString(), quantity: product.quantity });
      });
    });
  },
  StreamProductUpdates: (call) => {
    call.on('data', async (request) => {
      const { product_id, quantity } = request;
      try {
        const product = await Product.findById(product_id);
        if (!product) {
          call.write({ success: false, message: 'Product not found' });
          return;
        }
        product.quantity -= quantity;
        await product.save();
        call.write({ success: true, message: 'Product quantity updated', product_id: product._id.toString(), quantity: product.quantity });
      } catch (err) {
        call.write({ success: false, message: 'Failed to update product quantity' });
      }
    });

    call.on('end', () => {
      call.end();
    });
  },
  GetAllProducts: async (call, callback) => {
    try {
      // Fetch all products from the database
      const products = await Product.find();
      // Construct the ProductsList message
      const productList = {
        products: products.map(product => ({
          id: product._id.toString(),
          name: product.name,
          quantity: product.quantity,
          price: product.price
        }))
      };
      // Send back the productList as the response
      callback(null, productList);
    } catch (error) {
      // If an error occurs, send an error response
      console.error('Error fetching products:', error);
      callback(error, null);
    }
  },
  UpdateProductQuantity: async (call, callback) => {
    const { product_id, quantity } = call.request;
    try {
      const product = await Product.findById(product_id);
      if (product) {
        product.quantity -= quantity;
        await product.save();
        callback(null, { success: true, message: 'Product quantity updated successfully' });
      } else {
        callback(null, { success: false, message: 'Product not found' });
      }
    } catch (error) {
      callback(error);
    }
  }
});

server.bindAsync(
  `0.0.0.0:${process.env.GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Server listening on port ${port}`);
    server.start();
  }
);

mongoose.connect('mongodb://localhost:27017/products', {});
