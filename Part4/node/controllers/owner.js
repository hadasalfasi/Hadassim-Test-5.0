const Owner= require('../models/owner');
//הוספת מנהל חנות חדש
exports.addOwner=async (req,res)=>{
    const newSupplier=await Owner.create(req.body);
    res.json(newSupplier);
}