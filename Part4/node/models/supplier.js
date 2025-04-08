const mongoose=require('mongoose')
const supplierSchema=new mongoose.Schema({
    Company_name:String,
    Phone_number:String,
    Representative_name:String,
    password: { type: String, required: true },
    products : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})
module.exports=mongoose.model('Supplier',supplierSchema);