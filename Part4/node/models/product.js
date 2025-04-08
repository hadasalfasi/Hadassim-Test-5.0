const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    Product_Name:String,
    Item_Price:Number,
    Minimum_count:Number,
    
})
module.exports=mongoose.model('Product',productSchema);
// module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);

