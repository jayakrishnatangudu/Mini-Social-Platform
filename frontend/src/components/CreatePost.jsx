import { useState, useRef } from 'react';
import { Paper, TextField, Button, Box, Typography, Alert, IconButton, Chip } from '@mui/material';
import { Image, Send, CloudUpload, Close, VideoLibrary } from '@mui/icons-material';
import { postsAPI } from '../services/api';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only images (jpeg, png, gif) and videos (mp4, webm) are allowed');
                return;
            }
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
            setImageUrl(''); // Clear URL input if file is selected
            setError('');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim() && !imageUrl.trim() && !selectedFile) {
            setError('Please add some content, an image URL, or upload a file');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await postsAPI.createPost({
                content: content.trim(),
                image: imageUrl.trim(),
                file: selectedFile
            });

            // Clear form
            setContent('');
            setImageUrl('');
            clearFile();

            // Notify parent to refresh posts
            if (onPostCreated) onPostCreated();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const isVideo = selectedFile?.type?.startsWith('video/');

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h6" gutterBottom fontWeight={600}>
                Create a Post
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* File Upload Section */}
                <Box sx={{ mb: 2 }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                        style={{ display: 'none' }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ mr: 1 }}
                    >
                        Upload Image/Video
                    </Button>

                    {selectedFile && (
                        <Chip
                            icon={isVideo ? <VideoLibrary /> : <Image />}
                            label={selectedFile.name}
                            onDelete={clearFile}
                            sx={{ mt: 1 }}
                        />
                    )}
                </Box>

                {/* File Preview */}
                {preview && (
                    <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                        <IconButton
                            size="small"
                            onClick={clearFile}
                            sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.dark' }
                            }}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                        {isVideo ? (
                            <video
                                src={preview}
                                controls
                                style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: 8 }}
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: 8, objectFit: 'cover' }}
                            />
                        )}
                    </Box>
                )}

                {/* OR Divider */}
                {!selectedFile && (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                            — OR paste an image URL —
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Image URL (optional)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            InputProps={{
                                startAdornment: <Image sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                            sx={{ mb: 2 }}
                        />
                    </>
                )}

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Send />}
                        disabled={loading}
                        sx={{ px: 3 }}
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default CreatePost;
