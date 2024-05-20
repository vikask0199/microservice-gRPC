const Product = require('../models/product');

exports.createProduct = async (req, res) => {
  const { name, quantity, price } = req.body;
  const product = new Product({ name, quantity, price });
  await product.save();
  res.status(201).json(product);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, quantity, price } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, quantity, price },
    { new: true }
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.json({ message: 'Product deleted' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
