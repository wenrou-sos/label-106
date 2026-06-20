import { useRef, useState } from 'react';
import { Box, Typography, Button, LinearProgress, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, X, Image as ImageIcon, ErrorOutline } from '@mui/icons-material';
import { WorkPhoto, ServiceType } from '../../types';

interface PhotoUploaderProps {
  onUpload: (photo: WorkPhoto) => void;
  customerId: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function PhotoUploader({ onUpload, customerId }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return '仅支持 JPG 和 PNG 格式的图片';
    }
    if (file.size > MAX_FILE_SIZE) {
      return '图片大小不能超过 10MB';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const newPhoto: WorkPhoto = {
            id: `wp_${Date.now()}`,
            customerId,
            imageUrl: preview,
            serviceType: 'manicure' as ServiceType,
            createdAt: new Date().toLocaleString('zh-CN'),
            description: '新上传作品',
          };
          onUpload(newPhoto);
          setUploading(false);
          setPreview(null);
          return 100;
        }
        return p + 10;
      });
    }, 100);
  };

  const clearPreview = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Box
      sx={{
        border: '2px dashed rgba(212, 165, 116, 0.3)',
        borderRadius: '16px',
        p: preview ? 2 : 4,
        textAlign: preview ? 'left' : 'center',
        background: preview ? 'rgba(248, 232, 236, 0.3)' : 'rgba(212, 165, 116, 0.04)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: preview ? 'rgba(212, 165, 116, 0.3)' : 'rgba(212, 165, 116, 0.5)',
          background: preview ? 'rgba(248, 232, 236, 0.4)' : 'rgba(212, 165, 116, 0.08)',
        },
      }}
    >
      {!preview ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => inputRef.current?.click()}
          style={{ cursor: 'pointer' }}
        >
          <CloudUpload sx={{ fontSize: 48, color: '#D4A574', mb: 2 }} />
          <Typography sx={{ fontWeight: 600, color: '#4A3728', mb: 0.5 }}>
            点击上传作品照片
          </Typography>
          <Typography variant="caption" sx={{ color: '#8B7D75' }}>
            支持 JPG、PNG 格式，最大 10MB
          </Typography>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '12px',
                backgroundImage: `url(${preview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(212, 165, 116, 0.2)',
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon sx={{ fontSize: 18, color: '#8B7D75' }} />
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#4A3728' }}>
                    作品预览
                  </Typography>
                </Box>
                <Button
                  onClick={clearPreview}
                  disabled={uploading}
                  sx={{ minWidth: 'auto', p: 0.5, color: '#8B7D75' }}
                >
                  <X sx={{ fontSize: 18 }} />
                </Button>
              </Box>
              {uploading && (
                <Box sx={{ mb: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: 'rgba(212, 165, 116, 0.15)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #D4A574 0%, #E8C9A0 100%)',
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#8B7D75', mt: 0.5, display: 'block' }}>
                    上传中... {progress}%
                  </Typography>
                </Box>
              )}
              {!uploading && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleUpload}
                  sx={{
                    background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
                    boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B88B5A 0%, #D4A574 100%)',
                    },
                  }}
                >
                  确认上传
                </Button>
              )}
            </Box>
          </Box>
        </motion.div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
          >
            <Alert
              severity="error"
              icon={<ErrorOutline sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: '10px',
                background: 'rgba(232, 138, 127, 0.1)',
                color: '#D06B5E',
                '& .MuiAlert-icon': {
                  color: '#E88A7F',
                },
                fontSize: '0.8125rem',
                py: 0.75,
                px: 2,
              }}
            >
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
