import { useState } from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { ColorSwatch, COLOR_TAG_LABELS } from '../../types';
import { Check } from '@mui/icons-material';

interface ColorSwatchCardProps {
  color: ColorSwatch;
  index: number;
}

const tagStyles: Record<string, { bg: string; text: string }> = {
  hot: {
    bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    text: '#fff',
  },
  restocking: {
    bg: 'linear-gradient(135deg, #E8A87F 0%, #F5CFB8 100%)',
    text: '#fff',
  },
  expired: {
    bg: 'rgba(139, 125, 117, 0.4)',
    text: '#fff',
  },
};

export default function ColorSwatchCard({ color, index }: ColorSwatchCardProps) {
  const [hovered, setHovered] = useState(false);
  const isExpired = color.tags.includes('expired');
  const isRestocking = color.tags.includes('restocking');
  const disabled = isExpired || isRestocking;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ y: -6, scale: hovered && !disabled ? 1.03 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative',
        p: 2,
        borderRadius: '16px',
        background: '#fff',
        border: '1px solid rgba(212, 165, 116, 0.1)',
        boxShadow: '0 2px 8px rgba(74, 55, 40, 0.04)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: isExpired ? 0.6 : 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: disabled
            ? '0 2px 8px rgba(74, 55, 40, 0.04)'
            : '0 12px 28px rgba(74, 55, 40, 0.12)',
          borderColor: disabled ? 'rgba(212, 165, 116, 0.1)' : 'rgba(212, 165, 116, 0.3)',
        },
      }}
    >
      {isExpired && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            background: 'rgba(139, 125, 117, 0.08)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%',
            borderRadius: '12px',
            mb: 2,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: color.hexColor,
              transition: 'all 0.3s ease',
              transform: hovered && !disabled ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              px: 1,
              py: 0.25,
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#4A3728',
                fontFamily: 'monospace',
              }}
            >
              {color.code}
            </Typography>
          </Box>

          {hovered && !disabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(74,55,40,0.15)',
              }}
            >
              <Check sx={{ fontSize: 18, color: '#D4A574' }} />
            </motion.div>
          )}
        </Box>

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#4A3728',
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {color.name}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: '#8B7D75',
            display: 'block',
            mb: 1.5,
          }}
        >
          {color.brand}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {color.tags.map((tag) => {
            const style = tagStyles[tag];
            return (
              <Tooltip key={tag} title={COLOR_TAG_LABELS[tag]}>
                <Chip
                  label={
                    tag === 'hot'
                      ? '🔥 热门'
                      : tag === 'restocking'
                      ? '补货中'
                      : '已过期'
                  }
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    background: style.bg,
                    color: style.text,
                    border: 'none',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              </Tooltip>
            );
          })}
          {!color.inStock && !color.tags.includes('restocking') && !color.tags.includes('expired') && (
            <Chip
              label="缺货"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6875rem',
                fontWeight: 600,
                background: 'rgba(139, 125, 117, 0.15)',
                color: '#6B5D55',
                border: 'none',
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
