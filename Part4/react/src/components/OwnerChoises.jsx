import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SupplierProducts from './SupplierProducts';
import { Button, Container, Typography, Box, Card, CardContent } from '@mui/material';
import { Grid } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';

function OwnerChoises() {
  const [suppliers, setSuppliers] = useState([]);  // רשימת ספקים
  const [orders, setOrders] = useState([]);  // רשימת הזמנות
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);  
  const [showOrders, setShowOrders] = useState(false);  //  אם להציג הזמנות או לא
  const [showSuppliers, setShowSuppliers] = useState(false);  //  אם להציג ספקים או לא
  const [ownerId] = useState(sessionStorage.getItem('supplierId'));

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/supplier');
        setSuppliers(res.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    // טוען ספקים רק כאשר "הצג ספקים" נלחץ
    if (showSuppliers) {
      fetchSuppliers();
    }
  }, [showSuppliers]);

  // נשלחת רק כשמשתמש לוחץ על הצג הזמנות
  const handleShowOrders = async () => {
    if (!ownerId) {
      console.error('לא נמצא ownerId');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/orders/${ownerId}/orders`);
      setOrders(res.data);
      setShowOrders(true);
      setShowSuppliers(false); 
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const showInprogreesOrders = async () => {
    if (!ownerId) {
      console.error('לא נמצא ownerId');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/orders/${ownerId}/orders`);


      const inProgressOrders = res.data.filter(order =>
        order.status === "In progress"
      );
      setOrders(inProgressOrders);
      setShowOrders(true);
      setShowSuppliers(false); 
    } catch (err) {
      console.error("Error fetching orders:", err);
    }

  };
//מציג עמוד של ספק שנבחר
  if (selectedSupplierId) {
    return (
      <SupplierProducts
        supplierId={selectedSupplierId}
        ownerId={ownerId}
        onBack={() => setSelectedSupplierId(null)}
      />
    );
  }

  const changeStatusOfOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}`);
      setOrders(prevOrder =>
        prevOrder.map(order =>
          order._id === orderId ? { ...order, status: "Completed" } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">ברוך הבא:מנהל</Typography>

      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={() => { setShowSuppliers(true); setShowOrders(false); }} sx={{ margin: '0 10px' }}>
          הצג ספקים
        </Button>
        <Button variant="contained" color="primary" onClick={handleShowOrders} sx={{ margin: '0 10px' }}>
          הצג הזמנות
        </Button>
        <Button variant="contained" color="primary" onClick={showInprogreesOrders} sx={{ margin: '0 10px' }}>
          הצג הזמנות קיימות
        </Button>
      </Box>

      
      {showSuppliers && (
        <div>
          <Typography variant="h5" gutterBottom align="center">רשימת ספקים:</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {suppliers.map((supplier) => (
              <Card key={supplier._id} sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, border: '1px solid #1976d2' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setSelectedSupplierId(supplier._id)}
                    sx={{ alignSelf: 'center', marginRight: 2 }}
                  >
                    הצג מוצרי ספק
                  </Button>
                  <Typography variant="h6" sx={{ flex: 1, textAlign: 'right' }}>
                    {supplier.Company_name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </div>
      )}

      {showOrders && (
        <div>
          <Typography variant="h5" gutterBottom>הזמנות:</Typography>
          {orders.length === 0 ? (
            <Typography variant="body1">לא נמצאו הזמנות</Typography>
          ) : (
            orders.map((order) => (
              <Box
                key={order._id}
                marginBottom={2}
                padding={2}
                border={2}
                borderColor="#1976d2"
                borderRadius={2}
                sx={{ direction: 'rtl' }} 
              >
                <Grid container alignItems="center" justifyContent="space-between">
                
                  <Grid item xs={10}>
                    <Typography variant="body1">מספר הזמנה: {order._id}</Typography>
                    <Typography variant="body2">מספר פריטים: {order.items.length}</Typography>
                    
                  </Grid>

                 
                  <Grid item xs={2} textAlign="left">
                    {order.status === "In progress" ? (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => changeStatusOfOrder(order._id)}
                      >
                        In progress
                      </Button>
                    ) : (
                      <Button variant="contained" disabled>
                        {order.status}
                      </Button>
                    )}
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
                  </Grid>
                </Grid>
              </Box>
            ))
          )}
        </div>
      )}

    </Container>
  );
}

export default OwnerChoises;





