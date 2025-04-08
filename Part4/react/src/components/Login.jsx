import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';

function Login() {
  const [Name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login/login', {
        username: Name,
        password: password,
      });

      const user = res.data;

      if (user.role === 'owner') {
        sessionStorage.setItem('supplierId', res.data.user._id);
        navigate('/owner/ownerchises');
      } else if (user.role === 'supplier') {
        sessionStorage.setItem('supplierId', res.data.user._id);
        navigate('/supplier/supllierchoises');
      } else {
        navigate('/register');
      }
    } catch (err) {
      console.error('User not found, redirecting to register...');
      navigate('/register');
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        margin: '0', 
        width: '100%' 
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontSize: '2.5rem', color: '#000', marginBottom: '20px' }}>
        התחברות
      </Typography>

      <TextField
        label="שם משתמש"
        variant="outlined"
        fullWidth
        value={Name}
        onChange={(e) => setName(e.target.value)}
        sx={{
          marginBottom: '20px',
          width: '100%', 
          maxWidth: '400px', 
          '& .MuiInputLabel-root': {
            color: '#1976d2', 
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#1976d2', 
            },
            '&:hover fieldset': {
              borderColor: '#1565c0', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1565c0', 
            },
          },
        }}
      />

      <TextField
        label="סיסמה"
        variant="outlined"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          marginBottom: '20px',
          width: '100%', 
          maxWidth: '400px', 
          '& .MuiInputLabel-root': {
            color: '#1976d2', 
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#1976d2', 
            },
            '&:hover fieldset': {
              borderColor: '#1565c0', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1565c0', 
            },
          },
        }}
      />

      
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        sx={{
          fontSize: '1.2rem',
          padding: '10px 20px',
          width: '100%',  
          maxWidth: '400px', 
          marginBottom: '20px', 
        }}
      >
        התחבר
      </Button>
    </Box>
  );
}

export default Login;

