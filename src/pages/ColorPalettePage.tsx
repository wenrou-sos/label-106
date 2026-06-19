import { useState } from 'react';
import { Box, Typography, Chip, Grid, TextField, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { useColorPaletteStore } from '../store/colorPaletteStore';
import ColorSwatchCard from '../components/color-palette/ColorSwatchCard';
import { Search, Palette, Whatshot, Refresh, Warning } from '@mui/icons-material';
import { ColorTag } from '../types';

export default function ColorPalettePage() {
  const { colors } = useColorPaletteStore();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<ColorTag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const brands = Array.from(new Set(colors.map((c) => c.brand)));

  const filteredColors = colors.filter((color) => {
    const matchBrand = !selectedBrand || color.brand === selectedBrand;
    const matchTag = !selectedTag || color.tags.includes(selectedTag);
    const matchSearch =
      !searchQuery ||
      color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      color.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      color.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBrand && matchTag && matchSearch;
  });

  const hotCount = colors.filter((c) => c.tags.includes('hot')).length;
  const restockingCount = colors.filter((c) => c.tags.includes('restocking')).length;
  const expiredCount = colors.filter((c) => c.tags.includes('expired')).length;

  const tagFilters = [
    { tag: 'hot' as ColorTag, label: '本月热门', icon: Whatshot, color: '#FFA500', count: hotCount },
    {
      tag: 'restocking' as ColorTag,
      label: '补货中',
      icon: Refresh,
      color: '#E8A87F',
      count: restockingCount,
    },
    {
      tag: 'expired' as ColorTag,
      label: '已过期',
      icon: Warning,
      color: '#8B7D75',
      count: expiredCount,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#4A3728',
            mb: 1,
          }}
        >
          色板管理
        </Typography>
        <Typography variant="body1" sx={{ color: '#8B7D75' }}>
          浏览各品牌甲油胶色号，快速找到适合顾客的颜色
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="搜索色号、名称或品牌..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                background: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(212, 165, 116, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(212, 165, 116, 0.4)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#8B7D75' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="caption"
          sx={{ color: '#8B7D75', display: 'block', mb: 1.5, fontWeight: 500 }}
        >
          按品牌筛选
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="全部品牌"
            onClick={() => setSelectedBrand(null)}
            sx={{
              borderRadius: '10px',
              height: 32,
              px: 0.5,
              background: selectedBrand === null ? 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)' : '#fff',
              color: selectedBrand === null ? '#fff' : '#4A3728',
              fontWeight: selectedBrand === null ? 600 : 500,
              border: selectedBrand === null ? 'none' : '1px solid rgba(212, 165, 116, 0.2)',
              '&:hover': {
                background: selectedBrand === null
                  ? 'linear-gradient(135deg, #B88B5A 0%, #D4A574 100%)'
                  : 'rgba(212, 165, 116, 0.08)',
              },
            }}
          />
          {brands.map((brand) => (
            <Chip
              key={brand}
              label={brand}
              onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
              sx={{
                borderRadius: '10px',
                height: 32,
                px: 0.5,
                background:
                  selectedBrand === brand
                    ? 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)'
                    : '#fff',
                color: selectedBrand === brand ? '#fff' : '#4A3728',
                fontWeight: selectedBrand === brand ? 600 : 500,
                border:
                  selectedBrand === brand ? 'none' : '1px solid rgba(212, 165, 116, 0.2)',
                '&:hover': {
                  background:
                    selectedBrand === brand
                      ? 'linear-gradient(135deg, #B88B5A 0%, #D4A574 100%)'
                      : 'rgba(212, 165, 116, 0.08)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="caption"
          sx={{ color: '#8B7D75', display: 'block', mb: 1.5, fontWeight: 500 }}
        >
          按标签筛选
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            icon={<Palette sx={{ fontSize: 16 }} />}
            label={`全部 (${colors.length})`}
            onClick={() => setSelectedTag(null)}
            sx={{
              borderRadius: '10px',
              height: 32,
              background: selectedTag === null ? 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)' : '#fff',
              color: selectedTag === null ? '#fff' : '#4A3728',
              fontWeight: selectedTag === null ? 600 : 500,
              border: selectedTag === null ? 'none' : '1px solid rgba(212, 165, 116, 0.2)',
              '& .MuiChip-icon': {
                color: selectedTag === null ? '#fff' : '#D4A574',
              },
              '&:hover': {
                background:
                  selectedTag === null
                    ? 'linear-gradient(135deg, #B88B5A 0%, #D4A574 100%)'
                    : 'rgba(212, 165, 116, 0.08)',
              },
            }}
          />
          {tagFilters.map((filter) => (
            <Chip
              key={filter.tag}
              icon={<filter.icon sx={{ fontSize: 16 }} />}
              label={`${filter.label} (${filter.count})`}
              onClick={() => setSelectedTag(selectedTag === filter.tag ? null : filter.tag)}
              sx={{
                borderRadius: '10px',
                height: 32,
                background:
                  selectedTag === filter.tag
                    ? `linear-gradient(135deg, ${filter.color} 0%, ${filter.color}CC 100%)`
                    : '#fff',
                color: selectedTag === filter.tag ? '#fff' : '#4A3728',
                fontWeight: selectedTag === filter.tag ? 600 : 500,
                border:
                  selectedTag === filter.tag ? 'none' : '1px solid rgba(212, 165, 116, 0.2)',
                '& .MuiChip-icon': {
                  color: selectedTag === filter.tag ? '#fff' : filter.color,
                },
                '&:hover': {
                  background:
                    selectedTag === filter.tag
                      ? `linear-gradient(135deg, ${filter.color} 0%, ${filter.color} 100%)`
                      : 'rgba(212, 165, 116, 0.08)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#4A3728',
          }}
        >
          色号列表
        </Typography>
        <Typography variant="caption" sx={{ color: '#8B7D75' }}>
          共 {filteredColors.length} 个色号
        </Typography>
      </Box>

      {filteredColors.length === 0 ? (
        <Box
          sx={{
            py: 10,
            textAlign: 'center',
            borderRadius: '16px',
            background: 'rgba(248, 232, 236, 0.3)',
            border: '1px dashed rgba(212, 165, 116, 0.2)',
          }}
        >
          <Palette sx={{ fontSize: 48, color: '#D4A574', mb: 2 }} />
          <Typography sx={{ color: '#8B7D75', fontWeight: 500 }}>未找到匹配的色号</Typography>
          <Typography variant="caption" sx={{ color: '#8B7D75', display: 'block', mt: 0.5 }}>
            请尝试调整筛选条件
          </Typography>
        </Box>
      ) : (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
              xl: 'repeat(6, 1fr)',
            },
            gap: 2,
          }}
        >
          {filteredColors.map((color, index) => (
            <ColorSwatchCard key={color.id} color={color} index={index} />
          ))}
        </Box>
      )}
    </Box>
  );
}
