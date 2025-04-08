const Order=require('../models/orders');
const Product =require('../models/product');

//הוספת הזמנה חדשה
exports.createOrder = async (req, res) => {
  try {
    const { supplier_id, owner_id, items } = req.body;
    
    
    if (!supplier_id || !owner_id || !Array.isArray(items)/* || items.length === 0*/) {
      return res.status(400).json({ message: 'חסרים שדות נדרשים' });
    }
   
    
    const newOrder = new Order({
      supplier_id,
      owner_id,
      items
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('שגיאה בהוספת הזמנה:', error);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};


//קבלת הזמנה לפי ID
exports.getOrdersById = async (req, res) => {
  try {
    const { userId } = req.params; 

    const orders = await Order.find({
      $or: [
        { owner_id: userId },
        { supplier_id: userId }
      ]
    })
    /*.populate('owner_id', ' first_name')*//*.populate('items.product_id', 'Product_Name') */.populate('items'); 

    if (orders.length==0) {
      return res.status(200).json([]);
    }

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
//שינוי סטטוס להזמנה
exports.changStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    // alert(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'Pending') {
      order.status =  'In progress';
    } 
    else {
      if (order.status ===  'In progress') {
        order.status = 'Completed';
      } 
      else {
        return res.status(400).json({ message: 'Order status cant changed' });
      }
    }
    await order.save();
    res.status(200).json({ message: `Order status updated to ${order.status}`, order });
  }
   catch (error) {
    console.error('Failed to change order status', error);
    res.status(500).json({ message: 'Failed to change order status' });
  }
};
