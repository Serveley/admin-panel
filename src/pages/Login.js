import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/login', { email, password });
      if (response.data.success) {
        onLogin(response.data.token, response.data.admin);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(20, 184, 166, 0.05) 90%), #0f172a',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          top: '-10%',
          left: '-10%',
          filter: 'blur(100px)',
          opacity: 0.35,
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
          bottom: '-10%',
          right: '-10%',
          filter: 'blur(100px)',
          opacity: 0.3,
          zIndex: 1,
        }
      }}
    >
      <Card 
        sx={{ 
          maxWidth: 420, 
          width: '100%', 
          mx: 2, 
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', 
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          zIndex: 10,
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            textAlign="center" 
            gutterBottom 
            fontWeight="800" 
            color="primary.light"
            sx={{ letterSpacing: '-1px', fontFamily: '"Outfit", sans-serif' }}
          >
            Serveley
          </Typography>
          <Typography 
            variant="body1" 
            textAlign="center" 
            color="grey.400" 
            fontWeight="600" 
            gutterBottom
            sx={{ mb: 1 }}
          >
            Admin Panel
          </Typography>
          <Typography 
            variant="caption" 
            textAlign="center" 
            display="block" 
            color="grey.500" 
            sx={{ mb: 4 }}
          >
            Default: <span style={{ color: '#818cf8', fontWeight: 'bold' }}>admin@serveley.com</span> / <span style={{ color: '#818cf8', fontWeight: 'bold' }}>admin123</span>
          </Typography>
 
          {error && (
            <Alert 
              severity="error" 
              variant="outlined"
              sx={{ 
                mb: 3, 
                color: '#ef4444', 
                borderColor: 'rgba(239, 68, 68, 0.4)', 
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                borderRadius: '12px' 
              }}
            >
              {error}
            </Alert>
          )}
 
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
                mb: 2,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
                mb: 3,
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ 
                mt: 2, 
                py: 1.5, 
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.4)',
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
