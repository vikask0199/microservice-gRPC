const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
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

const port = process.env.GRPC_PORT || 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server running at http://0.0.0.0:${port}`);
  server.start();
});
