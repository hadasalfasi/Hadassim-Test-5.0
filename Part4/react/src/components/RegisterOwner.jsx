import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container } from '@mui/material';

function RegisterOwner() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/Owner', {
        first_name: firstName,
        last_name: lastName,
        password,
      });
      alert('נרשמת בהצלחה!');
      sessionStorage.setItem('supplierId', res.data._id);
      navigate("/owner/ownerchises");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ textAlign: 'center', marginTop: '100px' }}>
        <Typography variant="h4" gutterBottom>
          הרשמת מנהל חנות
        </Typography>

        <TextField
          label="שם פרטי"
          variant="outlined"
          fullWidth
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="שם משפחה"
          variant="outlined"
          fullWidth
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ marginTop: '20px' }}
        >
          הרשם
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterOwner;

