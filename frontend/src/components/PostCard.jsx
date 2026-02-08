import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    IconButton,
    Box,
    TextField,
    Button,
    Divider,
    Collapse,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    ChatBubbleOutline,
    Send,
} from '@mui/icons-material';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Helper to get full media URL
const getMediaUrl = (url) => {
    if (!url) return null;
    // If it's a relative path (starts with /uploads), prepend API base URL
    if (url.startsWith('/uploads')) {
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4002';
        return `${baseUrl}${url}`;
    }
    return url;
};

// Check if URL is video
const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);

    const isLiked = user && post.likes.includes(user.id);

    const handleLike = async () => {
        try {
            const response = await postsAPI.likePost(post._id);
            if (onUpdate) onUpdate(response.data.post);
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setLoading(true);
        try {
            const response = await postsAPI.addComment(post._id, { text: commentText });
            setCommentText('');
            if (onUpdate) onUpdate(response.data.post);
        } catch (err) {
            console.error('Comment error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInMs = now - postDate;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return postDate.toLocaleDateString();
    };

    const mediaUrl = getMediaUrl(post.image);
    const isVideo = isVideoUrl(post.image);

    return (
        <Card
            sx={{
                mb: 3,
                borderRadius: 2,
            }}
        >
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {post.userId?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                }
                title={
                    <Typography variant="subtitle1" fontWeight={600}>
                        {post.userId?.username || 'Unknown User'}
                    </Typography>
                }
                subheader={formatDate(post.createdAt)}
            />

            {post.content && (
                <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body1">{post.content}</Typography>
                </CardContent>
            )}

            {/* Media display - supports both images and videos */}
            {mediaUrl && (
                isVideo ? (
                    <Box sx={{ px: 2, pb: 2 }}>
                        <video
                            src={mediaUrl}
                            controls
                            style={{
                                width: '100%',
                                maxHeight: 500,
                                borderRadius: 8,
                            }}
                        />
                    </Box>
                ) : (
                    <Box
                        component="img"
                        src={mediaUrl}
                        alt="Post content"
                        sx={{
                            width: '100%',
                            maxHeight: 500,
                            objectFit: 'cover',
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                )
            )}

            <CardActions disableSpacing sx={{ px: 2, py: 1 }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
                        {isLiked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.likes.length}
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} ml={2}>
                    <IconButton onClick={() => setShowComments(!showComments)}>
                        <ChatBubbleOutline />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.comments.length}
                    </Typography>
                </Box>
            </CardActions>

            <Collapse in={showComments} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent>
                    {/* Comments list */}
                    {post.comments.length > 0 && (
                        <Box mb={2}>
                            {post.comments.map((comment, index) => (
                                <Box key={index} mb={2}>
                                    <Box display="flex" alignItems="flex-start" gap={1}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: 'secondary.main',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {/* Use stored username or fall back to populated userId */}
                                            {(comment.username || comment.userId?.username)?.charAt(0).toUpperCase() || 'U'}
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {/* Use stored username (per assignment) or fall back */}
                                                {comment.username || comment.userId?.username || 'Unknown User'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {comment.text}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(comment.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Add comment form */}
                    {user && (
                        <form onSubmit={handleComment}>
                            <Box display="flex" gap={1}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    endIcon={<Send />}
                                    disabled={loading || !commentText.trim()}
                                >
                                    Send
                                </Button>
                            </Box>
                        </form>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default PostCard;
