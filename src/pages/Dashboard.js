import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  Store as StoreIcon,
  DesignServices as ServicesIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#10b981', '#f59e0b']; // Clean emerald for active, amber for inactive

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const vendorData = stats ? [
    { name: 'Active', value: stats.activeVendors },
    { name: 'Inactive', value: stats.inactiveVendors },
  ] : [];

  const StatCard = ({ title, value, icon, color }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(99, 102, 241, 0.12), 0 4px 12px -5px rgba(99, 102, 241, 0.05)',
          borderColor: 'rgba(99, 102, 241, 0.2)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.75rem' }}>
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: color + '15',
              borderRadius: '12px',
              p: 1.2,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
          </Box>
        </Box>
        <Typography variant="h3" fontWeight="800" sx={{ fontFamily: '"Outfit", sans-serif', color: 'text.primary', letterSpacing: '-1px' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LinearProgress sx={{ borderRadius: 4, height: 4 }} />;
  }

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h4" gutterBottom fontWeight="800" sx={{ mb: 4, letterSpacing: '-0.8px', fontFamily: '"Outfit", sans-serif' }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vendors"
            value={stats?.totalVendors || 0}
            icon={<StoreIcon />}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Vendors"
            value={stats?.activeVendors || 0}
            icon={<ActiveIcon />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Services"
            value={stats?.totalServices || 0}
            icon={<ServicesIcon />}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Services"
            value={stats?.activeServices || 0}
            icon={<ActiveIcon />}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 3, fontFamily: '"Outfit", sans-serif' }}>
                Vendor Status Distribution
              </Typography>
              <Box sx={{ height: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vendorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      fill="#8884d8"
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {vendorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 4, fontFamily: '"Outfit", sans-serif' }}>
                System Verification
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 4.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">
                      Active Vendors Ratio
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight="700">
                      {stats?.activeVendors || 0} / {stats?.totalVendors || 0} ({stats?.totalVendors ? Math.round((stats.activeVendors / stats.totalVendors) * 100) : 0}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats?.totalVendors ? (stats.activeVendors / stats.totalVendors) * 100 : 0} 
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(16, 185, 129, 0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 4 } }}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">
                      Active Services Ratio
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight="700">
                      {stats?.activeServices || 0} / {stats?.totalServices || 0} ({stats?.totalServices ? Math.round((stats.activeServices / stats.totalServices) * 100) : 0}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats?.totalServices ? (stats.activeServices / stats.totalServices) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(99, 102, 241, 0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1', borderRadius: 4 } }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
