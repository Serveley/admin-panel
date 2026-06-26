import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddTask as SeedIcon,
} from '@mui/icons-material';
import axios from 'axios';

const CATEGORIES = [
  'Home Services',
  'Personal Care',
  'Cleaning',
  'Repairs',
  'Automotive',
  'Beauty',
  'Wellness',
  'Other'
];

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Home Services',
    icon: 'service',
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSeedServices = async () => {
    if (!window.confirm('This will replace all existing services with defaults. Continue?')) return;
    try {
      const response = await axios.post('/api/services/seed');
      if (response.data.success) {
        fetchServices();
        alert(`Created ${response.data.services.length} services!`);
      }
    } catch (error) {
      alert('Failed to seed services');
    }
  };

  const handleOpenDialog = (service = null) => {
    setEditingService(service);
    setError('');
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        category: service.category,
        icon: service.icon,
        isActive: service.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Home Services',
        icon: 'service',
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingService) {
        await axios.put(`/api/services/${editingService._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/services', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      handleCloseDialog();
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Home Services': 'primary',
      'Personal Care': 'success',
      'Cleaning': 'info',
      'Repairs': 'warning',
      'Automotive': 'secondary',
      'Beauty': 'error',
      'Wellness': 'default',
      'Other': 'default',
    };
    return colors[category] || 'default';
  };

  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-0.8px', fontFamily: '"Outfit", sans-serif' }}>
          Services Catalog
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SeedIcon />}
            onClick={handleSeedServices}
            sx={{ borderRadius: '10px', fontWeight: 'bold' }}
          >
            Seed Defaults
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: '10px', fontWeight: 'bold', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
          >
            Add Service
          </Button>
        </Box>
      </Box>

      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: '16px', 
          border: '1px solid rgba(226, 232, 240, 0.8)', 
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(248, 250, 252, 0.8)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: '700', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.8px', py: 2 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: '700', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.8px', py: 2 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: '700', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.8px', py: 2 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: '700', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.8px', py: 2 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: '700', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.8px', py: 2, pr: 3 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow 
                key={service._id}
                sx={{ 
                  '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.02)' }, 
                  transition: 'background-color 0.2s ease',
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell sx={{ py: 2.2 }}>
                  <Typography fontWeight="700" color="text.primary" sx={{ fontSize: '0.95rem' }}>{service.name}</Typography>
                </TableCell>
                <TableCell sx={{ py: 2.2 }}>
                  <Chip
                    label={service.category}
                    color={getCategoryColor(service.category)}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: '600', borderRadius: '6px' }}
                  />
                </TableCell>
                <TableCell sx={{ py: 2.2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, lineHeight: 1.5 }} noWrap>
                    {service.description}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2.2 }}>
                  <Chip
                    label={service.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{ 
                      fontWeight: 'bold', 
                      borderRadius: '6px',
                      bgcolor: service.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: service.isActive ? '#10b981' : '#ef4444',
                      border: 'none'
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: 2.2, pr: 2 }}>
                  <IconButton onClick={() => handleOpenDialog(service)} size="small" sx={{ mr: 1, color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.06)' } }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(service._id)} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'rgba(239,68,68,0.06)' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '20px', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: '800', fontFamily: '"Outfit", sans-serif', fontSize: '1.25rem', pb: 1 }}>
          {editingService ? '✏️ Edit Service Details' : '✨ Add New Service'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" variant="outlined" sx={{ mb: 2, borderRadius: '10px' }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Icon Name"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                helperText="Reference to icon identifier"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (editingService ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Services;
