const Product=require('../models/product');
const Supplier=require('../models/supplier');

//הוספת  מוצרים לקולקשיין של המוצרים מתוך מערך
exports.addProduct=async (req,res)=>{
    const productsarr=req.body;
    const newProduct=await Product.insertMany(productsarr.map(p=>({...p})));
    console.log(newProduct);
    
    res.json(newProduct);
}

//קבלת מוצרים לפי ספק
exports.getSupplierProducts = async (req, res) => {
    try {
      const { supplierId } = req.params;
      

      const supplier = await Supplier.findById(supplierId).populate('products');
     
      console.log(supplier);
  
      if (!supplier) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
  
      return res.json(supplier.products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
}

  
