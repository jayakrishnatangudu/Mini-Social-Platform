import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#667eea', // Modern purple-blue
            light: '#818cf8',
            dark: '#4c1d95',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f59e0b', // Vibrant amber
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        success: {
            main: '#10b981',
        },
        error: {
            main: '#ef4444',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        // Extend as needed
        ...Array(19).fill('0 25px 50px -12px rgb(0 0 0 / 0.25)'),
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    },
                    transition: 'all 0.3s ease-in-out',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});

export default theme;
