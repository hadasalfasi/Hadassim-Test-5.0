
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Grid } from '@mui/material';

function RegisterTypeSelection() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', marginTop: '100px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: '2.5rem', color: '#000' }}>
        הרשמה
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.5rem', marginBottom: '30px', color: '#555' }}>
        בחר סוג משתמש:
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Button 
            variant="outlined" 
            color="primary"  
            onClick={() => navigate('/register/supplier')}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              fontSize: '1.5rem',
              padding: '15px 30px',
              minWidth: '200px',
              '&:hover': {
                borderColor: '#1565c0',
                color: '#1565c0',
              }
            }}
          >
            ספק
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate('/register/owner')}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              fontSize: '1.5rem',
              padding: '15px 30px',
              minWidth: '200px',
              '&:hover': {
                borderColor: '#1565c0',
                color: '#1565c0',
              }
            }}
          >
            מנהל חנות
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RegisterTypeSelection;

