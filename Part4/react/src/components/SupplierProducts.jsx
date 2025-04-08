import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Grid, Card, CardContent, Divider } from '@mui/material';

function SupplierProducts({ supplierId, ownerId, onBack }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/product/${supplierId}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('שגיאה בשליפת מוצרים', err);
      }
    };

    fetchProducts();
  }, [supplierId]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Number(value),
    }));
  };

  const handleSubmitOrder = async () => {

    const invalidItems = products.filter((p) => {
      const quantity = quantities[p._id] || 0;
      return quantity > 0 && quantity < p.Minimum_count;
    });
    
    if (invalidItems.length > 0) {
      const invalidProductDetails = invalidItems.map((item) => {
        return `${item.Product_Name} - מינימום הזמנה: ${item.Minimum_count}`;
      }).join(", ");
      alert(`המינימום להזמנה עבור המוצרים: ${invalidProductDetails} הוא יותר ממה שהוזן.`);
      return;  
    }

    const items = products
      .filter((p) => quantities[p._id] > 0)
      .map((p) => ({
        product_id: p._id,
        quantity: quantities[p._id],
      }));

    if (items.length === 0) {
      alert('בחר לפחות מוצר אחד עם כמות');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/orders/add', {
        supplier_id: supplierId,
        owner_id: ownerId,
        items,
      });
      alert('ההזמנה נשלחה בהצלחה');
      onBack(); 
    } catch (err) {
      console.error('שגיאה בשליחת הזמנה', err);
      alert('שגיאה בשליחת ההזמנה');
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>הזמנת מוצרים מהספק</Typography>
      <Box display="flex" justifyContent="center" marginBottom={3}>
        <Button variant="outlined" color="primary" onClick={onBack}>
          חזור לרשימת ספקים
        </Button>
      </Box>
      
      {products.length === 0 ? (
        <Typography variant="h6" align="center">לא נמצאו מוצרים לספק זה</Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>{product.Product_Name}</Typography>
                  <Typography variant="body1" color="textSecondary">מחיר: {product.Item_Price}₪</Typography>
                  <Divider sx={{ marginY: 1 }} />
                  <TextField
                    label="כמות"
                    type="number"
                    fullWidth
                    value={quantities[product._id] || ''}
                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box display="flex" justifyContent="center" marginTop={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitOrder}
          sx={{ padding: '10px 20px' }}
        >
          ביצוע הזמנה
        </Button>
      </Box>
    </Container>
  );
}

export default SupplierProducts;


