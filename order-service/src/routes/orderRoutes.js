const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/products', orderController.getAllProducts);
router.post('/stream-updates', orderController.streamProductUpdates);
router.post('/orders', orderController.createOrder);
// router.get('/orders/:id', orderController.getOrder);
// router.put('/orders/:id', orderController.updateOrder);
// router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
