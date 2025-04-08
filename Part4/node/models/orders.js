const mongoose =require('mongoose')

const orderSchema = new mongoose.Schema({
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'supplier', required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'owner', required: true },
    status: {
      type: String,
      enum: ['Pending', 'In progress', 'Completed'],
      default: 'Pending'
    },
    items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' }/*,*/
        // quantity: Number,
      }
    ]
  });
  
  module.exports = mongoose.model('Order', orderSchema);