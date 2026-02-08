import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" elevation={1}>
            <Toolbar>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    SocialPost
                </Typography>

                {user && (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                                {user.username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body1">{user.username}</Typography>
                        </Box>

                        <Button
                            color="inherit"
                            startIcon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
