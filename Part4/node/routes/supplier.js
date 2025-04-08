const express=require('express')
const router=express.Router();
const {getSupplierProducts,addSupplier,getAllSupplier}=require('../controllers/supplier');

router.post('/',addSupplier);
router.get('/',getAllSupplier);

 module.exports=router;





