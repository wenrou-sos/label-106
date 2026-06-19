import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FAF7F5 0%, #F8E8EC 100%)',
        p: 4,
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ textAlign: 'center' }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontSize: { xs: '5rem', md: '8rem' },
            fontWeight: 600,
            background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Playfair Display", serif',
            color: '#4A3728',
            mb: 1.5,
          }}
        >
          页面未找到
        </Typography>
        <Typography variant="body1" sx={{ color: '#8B7D75', mb: 4, maxWidth: 400, mx: 'auto' }}>
          您访问的页面不存在或已被移除，请返回首页继续浏览。
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Home />}
          onClick={() => navigate('/dashboard')}
          sx={{
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
            boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #B88B5A 0%, #D4A574 100%)',
            },
          }}
        >
          返回首页
        </Button>
      </Box>
    </Box>
  );
}
