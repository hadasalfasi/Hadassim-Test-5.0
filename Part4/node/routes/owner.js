const express=require('express')
const router=express.Router();
const {addOwner}=require('../controllers/owner')
router.post('/',addOwner);
module.exports=router;