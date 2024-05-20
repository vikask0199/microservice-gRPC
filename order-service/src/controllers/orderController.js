const Order = require('../models/order');
const productClient = require('../grpc/client');

exports.createOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  productClient.UpdateProductQuantity({ product_id: productId, quantity: quantity }, async (error, response) => {
    console.log("gRPC Error:", error);
    console.log("gRPC Response:", response);
    if (error || !response || !response.success) {
      return res.status(500).json({ message: 'Failed to update product quantity' });
    }

    try {
      const order = new Order({ productId, quantity });
      await order.save();
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
  });
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

exports.updateOrder = async (req, res) => {
  const { productId, quantity, status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { productId, quantity, status },
    { new: true }
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

exports.deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (order) {
    res.json({ message: 'Order deleted' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};
