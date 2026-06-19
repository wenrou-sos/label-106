import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Search,
  Notifications,
  Logout,
  Person,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useAppointmentStore } from '../../store/appointmentStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { lateAppointmentIds } = useAppointmentStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component={motion.div}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 2.5,
        borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#4A3728',
          }}
        >
          今日概览
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            borderRadius: '12px',
            background: 'rgba(212, 165, 116, 0.06)',
            border: '1px solid rgba(212, 165, 116, 0.1)',
            width: 320,
            transition: 'all 0.3s ease',
            '&:focus-within': {
              background: 'rgba(212, 165, 116, 0.1)',
              borderColor: 'rgba(212, 165, 116, 0.3)',
            },
          }}
        >
          <Search sx={{ fontSize: 20, color: '#8B7D75', mr: 1 }} />
          <InputBase
            placeholder="搜索顾客、预约..."
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: '#4A3728',
              '&::placeholder': {
                color: '#B8AA9D',
              },
            }}
          />
        </Box>

        <Tooltip title="通知">
          <IconButton
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'rgba(212, 165, 116, 0.06)',
              color: '#6B5D55',
              '&:hover': {
                background: 'rgba(212, 165, 116, 0.12)',
              },
            }}
          >
            <Badge
              badgeContent={lateAppointmentIds.length}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(135deg, #E88A7F 0%, #F5C4BE 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.6875rem',
                },
              }}
            >
              <Notifications sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        <Box
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pl: 1.5,
            pr: 2,
            py: 0.75,
            borderRadius: '50px',
            background: 'rgba(212, 165, 116, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(212, 165, 116, 0.12)',
            },
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              width: 36,
              height: 36,
              border: '2px solid #fff',
              boxShadow: '0 2px 8px rgba(74,55,40,0.1)',
            }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#4A3728',
                lineHeight: 1.2,
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

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(74, 55, 40, 0.12)',
              border: '1px solid rgba(212, 165, 116, 0.1)',
              mt: 1,
              minWidth: 180,
            },
          }}
        >
          <MenuItem onClick={handleClose} sx={{ borderRadius: '10px', mx: 1, my: 0.5 }}>
            <Person sx={{ mr: 2, fontSize: 20, color: '#8B7D75' }} />
            <Typography sx={{ fontSize: '0.875rem' }}>个人资料</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              logout();
            }}
            sx={{ borderRadius: '10px', mx: 1, my: 0.5, color: '#E88A7F' }}
          >
            <Logout sx={{ mr: 2, fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>退出登录</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
