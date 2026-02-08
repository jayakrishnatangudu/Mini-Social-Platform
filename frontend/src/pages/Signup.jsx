import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Link,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.register(formData);
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                        Create Account
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Join our social platform
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoComplete="username"
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoComplete="email"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoComplete="new-password"
                            helperText="Minimum 6 characters"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </Button>

                        <Typography variant="body2" align="center">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" underline="hover">
                                Login
                            </Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Signup;
