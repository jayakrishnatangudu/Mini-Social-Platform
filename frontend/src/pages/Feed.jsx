import { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { postsAPI } from '../services/api';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await postsAPI.getAllPosts(pageNum, 10);
            const { posts: newPosts, pagination } = response.data;

            if (append) {
                setPosts(prev => [...prev, ...newPosts]);
            } else {
                setPosts(newPosts);
            }

            setHasMore(pagination.hasMore);
            setPage(pageNum);
            setError('');
        } catch (err) {
            setError('Failed to load posts');
            console.error('Fetch posts error:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchPosts(page + 1, true);
        }
    };

    const handlePostCreated = () => {
        // Refresh from page 1 when new post is created
        fetchPosts(1, false);
    };

    const handlePostUpdate = (updatedPost) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
        );
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} mb={3}>
                    Social Feed
                </Typography>

                <CreatePost onPostCreated={handlePostCreated} />

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={() => fetchPosts()}>
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                ) : posts.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            No posts yet. Be the first to post!
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
                        ))}

                        {/* Load More Button */}
                        {hasMore && (
                            <Box display="flex" justifyContent="center" py={3}>
                                <Button
                                    variant="outlined"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    startIcon={loadingMore ? <CircularProgress size={20} /> : <Refresh />}
                                >
                                    {loadingMore ? 'Loading...' : 'Load More Posts'}
                                </Button>
                            </Box>
                        )}

                        {!hasMore && posts.length > 0 && (
                            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                                You've reached the end!
                            </Typography>
                        )}
                    </>
                )}
            </Container>
        </>
    );
};

export default Feed;
