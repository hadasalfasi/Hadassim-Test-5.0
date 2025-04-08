const express = require('express');
const router = express.Router();
const { getOrdersById,createOrder,changStatus } = require('../controllers/orders');
router.get('/:userId/orders', getOrdersById);
router.post('/add',createOrder);
router.put('/:orderId',changStatus);


module.exports = router;
