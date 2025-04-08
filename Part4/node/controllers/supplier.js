const Product = require('../models/product');
const Supplier = require('../models/supplier');

//הוספת ספק חדש
exports.addSupplier = async (req, res) => {
 
  try {
    const { Company_name, password, Phone_number, Representative_name, products } = req.body;

    // בדוק אם כבר קיים ספק עם אותו שם חברה
    const existingVendor = await Supplier.findOne({ Company_name });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: 'Vendor already exists' });
    }

    const vendor = new Supplier({ Company_name, password, Phone_number, Representative_name });

  
    if (products && products.length > 0) {
      // הוספת המוצרים לקולקשן של המוצרים
      const productDocs = await Product.insertMany(
        products.map(p => ({ ...p })) 
      );
      vendor.products = productDocs.map(p => p._id);
    }
    await vendor.save();

    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


//קבלת כל קשימת הספקים
exports.getAllSupplier=async (req,res)=>{
    const allSupplier=await Supplier.find();
    res.json(allSupplier);

}











