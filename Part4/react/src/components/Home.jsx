import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Grid } from '@mui/material';

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', marginTop: '100px' }}>
      <Typography variant="h3" gutterBottom sx={{ fontSize: '3rem', color: '#1976d2' }}>
        ברוכים הבאים
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Button 
            variant="outlined" 
            color="primary"  
            onClick={() => navigate('/login')}
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
            התחברות
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate('/register')}
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
            הרשמה
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
