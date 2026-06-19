import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Visibility, VisibilityOff, AutoAwesome } from '@mui/icons-material';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #FAF7F5 0%, #F8E8EC 50%, #F5F0EC 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,165,116,0.15) 0%, transparent 70%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(248,232,236,0.6) 0%, transparent 70%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 8 },
              width: '100%',
              maxWidth: 1100,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <Box sx={{ mb: 4 }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 12px 32px rgba(212, 165, 116, 0.35)',
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 36, color: '#fff' }} />
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 600,
                      color: '#4A3728',
                      mb: 1.5,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    精致美学
                    <br />
                    管理面板
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#8B7D75',
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      maxWidth: 380,
                    }}
                  >
                    专业的美甲店运营管理系统，让您的每一项服务都井然有序，
                    每一位顾客都宾至如归。
                  </Typography>
                </motion.div>
              </Box>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    height: 280,
                    background: 'linear-gradient(135deg, #F8E8EC 0%, #E8CCD3 100%)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url('https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.85,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(74,55,40,0.35) 100%)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: 20,
                      right: 20,
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#fff',
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      始于指尖，臻于至善
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
                      Elegance at Your Fingertips
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                sx={{
                  width: '100%',
                  p: { xs: 3, md: 5 },
                  borderRadius: '28px',
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 24px 64px rgba(74, 55, 40, 0.1)',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    color: '#4A3728',
                    mb: 1,
                  }}
                >
                  欢迎回来
                </Typography>
                <Typography variant="body2" sx={{ color: '#8B7D75', mb: 4 }}>
                  请登录以继续管理您的美甲店
                </Typography>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginBottom: 16 }}
                    >
                      <Alert severity="error" sx={{ borderRadius: '12px' }}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2.5 }}
                    autoComplete="username"
                  />

                  <TextField
                    fullWidth
                    label="密码"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#8B7D75' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        sx={{
                          color: '#D4A574',
                          '&.Mui-checked': { color: '#D4A574' },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.875rem', color: '#8B7D75' }}>记住我</Typography>}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      height: 52,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
                      boxShadow: '0 8px 24px rgba(212, 165, 116, 0.35)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #B88B5A 0%, #D4A574 100%)',
                        boxShadow: '0 12px 32px rgba(212, 165, 116, 0.45)',
                      },
                      '&:disabled': {
                        background: 'rgba(212, 165, 116, 0.5)',
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                      '登 录'
                    )}
                  </Button>
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: '1px solid rgba(139, 125, 117, 0.15)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#8B7D75' }}>
                    测试账号: admin / reception / tech1
                    <br />
                    密码: 123456
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
