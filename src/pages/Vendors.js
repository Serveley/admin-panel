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
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' },
    location: { coordinates: [0, 0] },
    services: [],
    isActive: true,
  });

  useEffect(() => {
    fetchVendors();
    fetchServices();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/vendors/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setVendors(response.data.vendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

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

  const handleOpenDialog = (vendor = null) => {
    setEditingVendor(vendor);
    setError('');
    if (vendor) {
      setFormData({
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        password: '',
        businessName: vendor.businessName,
        address: vendor.address || { street: '', city: '', state: '', zipCode: '', country: '' },
        location: vendor.location || { coordinates: [0, 0] },
        services: vendor.services.map(s => s.service._id),
        isActive: vendor.isActive,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        businessName: '',
        address: { street: '', city: '', state: '', zipCode: '', country: '' },
        location: { coordinates: [0, 0] },
        services: [],
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVendor(null);
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const formattedData = {
        ...formData,
        services: formData.services.map(id => ({ service: id, enabled: true }))
      };

      if (editingVendor) {
        await axios.put(`/api/vendors/admin/${editingVendor._id}`, formattedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/vendors/admin', formattedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      handleCloseDialog();
      fetchVendors();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/vendors/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVendors();
    } catch (error) {
      alert('Failed to delete vendor');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/vendors/admin/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVendors();
    } catch (error) {
      alert('Failed to toggle status');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Vendors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Vendor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor._id}>
                <TableCell>
                  <Typography fontWeight="medium">{vendor.businessName}</Typography>
                  <Typography variant="body2" color="textSecondary">{vendor.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{vendor.email}</Typography>
                  <Typography variant="body2" color="textSecondary">{vendor.phone}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{vendor.address?.city || 'N/A'}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {vendor.services.slice(0, 3).map((s, i) => (
                      <Chip
                        key={i}
                        label={s.service?.name}
                        size="small"
                        color={s.enabled ? 'success' : 'default'}
                      />
                    ))}
                    {vendor.services.length > 3 && (
                      <Chip label={`+${vendor.services.length - 3}`} size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={vendor.isActive ? 'Active' : 'Inactive'}
                    color={vendor.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(vendor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleToggleStatus(vendor._id)}>
                    {vendor.isActive ? <BlockIcon color="error" /> : <ActivateIcon color="success" />}
                  </IconButton>
                  <IconButton onClick={() => handleDelete(vendor._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            {!editingVendor && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={formData.address.street}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Services</InputLabel>
                <Select
                  multiple
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const service = services.find(s => s._id === value);
                        return <Chip key={value} label={service?.name || value} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {services.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            {loading ? <CircularProgress size={24} /> : (editingVendor ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Vendors;
