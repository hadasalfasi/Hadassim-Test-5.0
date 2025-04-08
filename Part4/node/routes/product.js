const express=require('express')
const router=express.Router();
const {getSupplierProducts,addProduct}=require('../controllers/product')
router.get('/:supplierId/products', getSupplierProducts);
router.post('/',addProduct);

module.exports=router;