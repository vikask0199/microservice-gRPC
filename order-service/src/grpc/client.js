const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
require('dotenv').config();

const packageDefinition = protoLoader.loadSync(__dirname + '/product.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const client = new productProto.ProductService(
  `localhost:${process.env.GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

module.exports = client;
