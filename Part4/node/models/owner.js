const mongoose=require('mongoose');

const ownerSchema=new mongoose.Schema({
    first_name:String,
    last_name: String,
    password: { type: String, required: true }
  });
module.exports=mongoose.model('Owner',ownerSchema);