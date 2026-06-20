import { NavLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  CalendarToday,
  PeopleAlt,
  Palette,
  PersonSearch,
  Logout,
  AutoAwesome,
  Schedule,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { path: '/dashboard', label: '今日预约', icon: CalendarToday },
  { path: '/dashboard/schedule', label: '排班管理', icon: Schedule },
  { path: '/dashboard/technicians', label: '美甲师状态', icon: PeopleAlt },
  { path: '/dashboard/color-palette', label: '色板管理', icon: Palette },
  { path: '/dashboard/customers', label: '顾客档案', icon: PersonSearch },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <Box
      sx={{
        width: 260,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF7F5 100%)',
        borderRight: '1px solid rgba(212, 165, 116, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
      }}
      component={motion.div}
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(212, 165, 116, 0.3)',
            }}
          >
            <AutoAwesome sx={{ fontSize: 24, color: '#fff' }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                fontSize: '1.125rem',
                color: '#4A3728',
                lineHeight: 1.2,
              }}
            >
              精致美学
            </Typography>
            <Typography variant="caption" sx={{ color: '#8B7D75' }}>
              Nail Salon
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <NavLink
              to={item.path}
              style={{ textDecoration: 'none', width: '100%' }}
              end={item.path === '/dashboard'}
            >
              {({ isActive }) => (
                <ListItemButton
                  component={motion.div}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    borderRadius: '12px',
                    px: 2,
                    py: 1.25,
                    position: 'relative',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(212,165,116,0.12) 0%, rgba(248,232,236,0.6) 100%)'
                      : 'transparent',
                    '&::before': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 24,
                          borderRadius: '0 3px 3px 0',
                          background: 'linear-gradient(180deg, #D4A574 0%, #E8C9A0 100%)',
                        }
                      : {},
                    '&:hover': {
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(212,165,116,0.18) 0%, rgba(248,232,236,0.7) 100%)'
                        : 'rgba(212, 165, 116, 0.06)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <item.icon
                      sx={{
                        fontSize: 22,
                        color: isActive ? '#D4A574' : '#8B7D75',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#4A3728' : '#6B5D55',
                    }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
          mx: 2,
          mb: 2,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #F8E8EC 0%, #FCF4F6 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundImage: `url(${user?.avatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid #fff',
              boxShadow: '0 2px 8px rgba(74,55,40,0.1)',
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#4A3728',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8B7D75' }}>
              {user?.role === 'owner'
                ? '店主'
                : user?.role === 'receptionist'
                ? '前台'
                : '美甲师'}
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: '10px',
            py: 1,
            color: '#8B7D75',
            '&:hover': {
              background: 'rgba(255,255,255,0.7)',
              color: '#E88A7F',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Logout sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="退出登录"
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}
