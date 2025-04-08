import React, { useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography, List, ListItem, ListItemText } from '@mui/material';

function SupplierChoises() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showSection, setShowSection] = useState(null);

  const fetchProducts = async () => {
    try {
      const supplierId = sessionStorage.getItem('supplierId');
      const res = await axios.get(`http://localhost:5000/product/${supplierId}/products`);
      setProducts(res.data);
      setShowSection('products');
    } catch (err) {
      console.error('שגיאה בקבלת פריטים:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const supplierId = sessionStorage.getItem('supplierId');
      const res = await axios.get(`http://localhost:5000/orders/${supplierId}/orders`);
      setOrders(res.data);
      setShowSection('orders');
    } catch (err) {
      console.error('שגיאה בקבלת הזמנות:', err);
    }
  };

  const changeStatusOfOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}`);
      setOrders(prevOrder =>
        prevOrder.map(order =>
          order._id === orderId ? { ...order, status: "In progress" } : order
        )
      );
    }
    catch (error) {
      console.error("Error updating order status", error);
    }
  };

  return (
    <Box sx={{ direction: 'rtl', padding: 3, fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h5" align="center">ברוך הבא: ספק</Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 3 }}>
        <Button variant="outlined" color="primary" onClick={fetchProducts}>
          הצג פריטים
        </Button>
        <Button variant="outlined" color="primary" onClick={fetchOrders}>
          הצג הזמנות
        </Button>
      </Box>

      {showSection === 'products' && (
        <Box sx={{ border: 2, borderColor: '#1976d2', padding: 2, margin: 2, borderRadius: 2 }}>
          <Typography variant="h6">הפריטים שלך:</Typography>
          <List>
            {products.map((product) => (
              <ListItem key={product._id}>
                <ListItemText
                  primary={`${product.Product_Name} : ${product.Item_Price} ש"ח`}
                  secondary={`מינימום הזמנה: ${product.Minimum_count}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {showSection === 'orders' && (
        <Box sx={{ border: 2, borderColor: '#1976d2', padding: 2, margin: 2, borderRadius: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            ההזמנות שלך:
          </Typography>

          {orders.length === 0 ? (
            <Typography align="center">אין הזמנות עדיין.</Typography>
          ) : (
            orders.map((order) => (
              <Box
                key={order._id}
                sx={{
                  border: 1,
                  borderColor: '#1976d2',
                  backgroundColor: '#f9f9f9',
                  padding: 2,
                  marginBottom: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1"><strong>מזמין:</strong> {order.owner_id}</Typography>
                    <Typography variant="body1"><strong>סטטוס:</strong> {order.status}</Typography>
                  </Box>

                  <Box>
                    {order.status === "Pending" ? (
                      <Button variant="contained" color="primary" onClick={() => changeStatusOfOrder(order._id)}>
                        Pending
                      </Button>
                    ) : (
                      <Button variant="contained" disabled>
                        {order.status}
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* <Button variant="outlined" color="primary" onClick={() => alert('הצגת המוצרים')}>
                  הצג מוצרים
                </Button> */}

                {order.items && (
                  <Box sx={{ marginTop: 2, padding: 2, border: 1, borderColor: '#ccc', borderRadius: 2 }}>
                    <Typography variant="h6">פרטי המוצרים בהזמנה:</Typography>
                    <List>
                      {order.items.map((item) => (
                        <ListItem key={item._id}>
                          <ListItemText
                            primary={`מוצר ID: ${item.product_id}`}
                            secondary={`כמות: ${item.quantity}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}

export default SupplierChoises;
