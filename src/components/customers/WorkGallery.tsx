import { Box, Typography, Dialog, DialogContent, IconButton } from '@mui/material';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkPhoto, SERVICE_TYPE_LABELS } from '../../types';
import { Close, CalendarToday } from '@mui/icons-material';

interface WorkGalleryProps {
  photos: WorkPhoto[];
}

export default function WorkGallery({ photos }: WorkGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<WorkPhoto | null>(null);

  if (photos.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          borderRadius: '16px',
          background: 'rgba(248, 232, 236, 0.3)',
          border: '1px dashed rgba(212, 165, 116, 0.2)',
        }}
      >
        <Typography variant="body1" sx={{ color: '#8B7D75' }}>
          暂无作品照片
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {photos.map((photo, index) => (
          <Box
            key={photo.id}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => setSelectedPhoto(photo)}
            sx={{
              position: 'relative',
              paddingTop: '100%',
              borderRadius: '14px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid rgba(212, 165, 116, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 28px rgba(74, 55, 40, 0.15)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, transparent 50%, rgba(74,55,40,0.6) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::after': {
                opacity: 1,
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${photo.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.5s ease',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                zIndex: 1,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {SERVICE_TYPE_LABELS[photo.serviceType]}
              </Typography>
              {photo.description && (
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.85)', display: 'block' }}
                >
                  {photo.description}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <AnimatePresence>
        {selectedPhoto && (
          <Dialog
            open={Boolean(selectedPhoto)}
            onClose={() => setSelectedPhoto(null)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(74, 55, 40, 0.25)',
              },
            }}
          >
            <DialogContent sx={{ p: 0, position: 'relative' }}>
              <IconButton
                onClick={() => setSelectedPhoto(null)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 40,
                  height: 40,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 2,
                  '&:hover': {
                    background: '#fff',
                  },
                }}
              >
                <Close sx={{ fontSize: 22, color: '#4A3728' }} />
              </IconButton>
              <Box
                sx={{
                  width: '100%',
                  paddingTop: '75%',
                  position: 'relative',
                  backgroundImage: `url(${selectedPhoto.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Box sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#4A3728',
                    mb: 1.5,
                  }}
                >
                  {SERVICE_TYPE_LABELS[selectedPhoto.serviceType]}
                </Typography>
                {selectedPhoto.description && (
                  <Typography sx={{ color: '#6B5D55', mb: 2, lineHeight: 1.6 }}>
                    {selectedPhoto.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, color: '#8B7D75' }} />
                  <Typography variant="caption" sx={{ color: '#8B7D75' }}>
                    {selectedPhoto.createdAt}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
