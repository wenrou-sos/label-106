import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#D4A574',
      light: '#E8C9A0',
      dark: '#B88B5A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F8E8EC',
      light: '#FCF4F6',
      dark: '#E8CCD3',
      contrastText: '#4A3728',
    },
    success: {
      main: '#A8D8D0',
      light: '#D0EBE6',
      dark: '#7CC0B5',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#E8A87F',
      light: '#F5CFB8',
      dark: '#D48B5C',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E88A7F',
      light: '#F5C4BE',
      dark: '#D06B5E',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#4A3728',
      secondary: '#8B7D75',
    },
    background: {
      default: '#FAF7F5',
      paper: '#FFFFFF',
    },
    grey: {
      50: '#FAF7F5',
      100: '#F5F0EC',
      200: '#E8DFD8',
      300: '#D4C9BF',
      400: '#B8AA9D',
      500: '#8B7D75',
      600: '#6B5D55',
      700: '#554840',
      800: '#4A3728',
      900: '#2E221C',
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans SC"',
      '"Playfair Display"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      fontSize: '1.125rem',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(74, 55, 40, 0.04)',
    '0 2px 4px rgba(74, 55, 40, 0.06)',
    '0 4px 8px rgba(74, 55, 40, 0.08)',
    '0 6px 12px rgba(74, 55, 40, 0.1)',
    '0 8px 16px rgba(74, 55, 40, 0.12)',
    '0 12px 24px rgba(74, 55, 40, 0.14)',
    '0 16px 32px rgba(74, 55, 40, 0.16)',
    '0 20px 40px rgba(74, 55, 40, 0.18)',
    '0 24px 48px rgba(74, 55, 40, 0.2)',
    '0 28px 56px rgba(74, 55, 40, 0.22)',
    '0 32px 64px rgba(74, 55, 40, 0.24)',
    '0 36px 72px rgba(74, 55, 40, 0.26)',
    '0 40px 80px rgba(74, 55, 40, 0.28)',
    '0 44px 88px rgba(74, 55, 40, 0.3)',
    '0 48px 96px rgba(74, 55, 40, 0.32)',
    '0 52px 104px rgba(74, 55, 40, 0.34)',
    '0 56px 112px rgba(74, 55, 40, 0.36)',
    '0 60px 120px rgba(74, 55, 40, 0.38)',
    '0 64px 128px rgba(74, 55, 40, 0.4)',
    '0 68px 136px rgba(74, 55, 40, 0.42)',
    '0 72px 144px rgba(74, 55, 40, 0.44)',
    '0 76px 152px rgba(74, 55, 40, 0.46)',
    '0 80px 160px rgba(74, 55, 40, 0.48)',
    '0 84px 168px rgba(74, 55, 40, 0.5)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(212, 165, 116, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(74, 55, 40, 0.06)',
          border: '1px solid rgba(212, 165, 116, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(74, 55, 40, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(212, 165, 116, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D4A574',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
export default theme;
