import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  DesignServices as ServicesIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

function Layout({ children, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/vendors', label: 'Vendors', icon: <StoreIcon /> },
    { path: '/services', label: 'Services', icon: <ServicesIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    onLogout();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'center', px: 2, py: 1 }}>
        <Typography variant="h5" fontWeight="800" color="primary" sx={{ letterSpacing: '-0.5px', fontFamily: '"Outfit", sans-serif' }}>
          Serveley
        </Typography>
        <Typography variant="caption" sx={{ ml: 1, px: 1, py: 0.2, bgcolor: 'primary.light', color: 'white', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem' }}>
          Admin
        </Typography>
      </Toolbar>
      <Divider sx={{ opacity: 0.6, mb: 2 }} />
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isSelected}
              sx={{
                borderRadius: '10px',
                mb: 1,
                px: 2,
                py: 1.2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.04)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '0.925rem'
                }} 
              />
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 'bold' }}>
          {(user.name || user.email)[0].toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight="600" noWrap>
            {user.name || 'Admin User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {user.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: '700', letterSpacing: '-0.3px' }}>
            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight="500" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.name || user.email}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen} size="small">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.875rem', fontWeight: 'bold' }}>
                {(user.name || user.email)[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
