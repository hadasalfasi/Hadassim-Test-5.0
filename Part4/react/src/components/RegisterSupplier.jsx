import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Grid } from '@mui/material';

function RegisterSupplier() {
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [repName, setRepName] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([
    { Product_Name: '', Item_Price: '', Minimum_count: '' }
  ]);
  const navigate = useNavigate();

  const handleAddProduct = () => {
    setProducts([...products, { Product_Name: '', Item_Price: '', Minimum_count: '' }]);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/Supplier', {
        Company_name: companyName,
        Phone_number: phone,
        Representative_name: repName,
        password,
        products,
      });
      sessionStorage.setItem('supplierId', res.data._id);
      alert('ההרשמה בוצעה בהצלחה');
      navigate('/supplier/supllierchoises');
    } catch (err) {
      console.error(err);
      alert('הייתה שגיאה בהרשמה');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h4" gutterBottom>
          הרשמת ספק
        </Typography>

        <TextField
          label="שם החברה"
          variant="outlined"
          fullWidth
          margin="normal"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <TextField
          label="טלפון"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label="שם נציג"
          variant="outlined"
          fullWidth
          margin="normal"
          value={repName}
          onChange={(e) => setRepName(e.target.value)}
        />
        <TextField
          label="סיסמה"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Typography variant="h6" gutterBottom>
          מוצרים
        </Typography>

        {products.map((product, index) => (
          <Box key={index} sx={{ marginBottom: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="שם מוצר"
                  variant="outlined"
                  fullWidth
                  value={product.Product_Name}
                  onChange={(e) => handleProductChange(index, 'Product_Name', e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="מחיר ליחידה"
                  variant="outlined"
                  fullWidth
                  value={product.Item_Price}
                  onChange={(e) => handleProductChange(index, 'Item_Price', e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="כמות מינימלית להזמנה"
                  variant="outlined"
                  fullWidth
                  value={product.Minimum_count}
                  onChange={(e) => handleProductChange(index, 'Minimum_count', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddProduct}
          sx={{ marginBottom: '20px' }}
        >
          + הוסף מוצר
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ marginTop: '20px' }}
        >
          הרשמה
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterSupplier;
