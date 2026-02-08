const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/posts
// @desc    Create a new post (with optional image/video upload)
// @access  Private
router.post('/', authMiddleware, upload.single('media'), async (req, res) => {
    try {
        const { content } = req.body;
        let imageUrl = req.body.image || null;

        // If file was uploaded, use the uploaded file URL
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Validation - at least text OR image must be present
        if (!content && !imageUrl) {
            return res.status(400).json({ error: 'Post must have either text content or image' });
        }

        const post = new Post({
            userId: req.userId,
            content: content || '',
            image: imageUrl
        });

        await post.save();

        // Populate user info for response
        await post.populate('userId', 'username');

        res.status(201).json({
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Server error while creating post' });
    }
});

// @route   GET /api/posts
// @desc    Get all posts with pagination (public feed)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination info
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        // Fetch posts with pagination
        const posts = await Post.find()
            .populate('userId', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasMore: page < totalPages
            }
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Server error while fetching posts' });
    }
});

// @route   PUT /api/posts/:id/like
// @desc    Toggle like on a post (prevents duplicate likes)
// @access  Private
router.put('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user already liked the post (prevent duplicates)
        const likeIndex = post.likes.findIndex(
            (id) => id.toString() === req.userId.toString()
        );

        if (likeIndex > -1) {
            // Unlike - remove user from likes array
            post.likes.splice(likeIndex, 1);
        } else {
            // Like - add user to likes array
            post.likes.push(req.userId);
        }

        await post.save();
        await post.populate('userId', 'username');

        res.json({
            message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
            post,
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Server error while liking post' });
    }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to a post (saves username with comment)
// @access  Private
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Get user info to save username with comment
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Add comment with userId AND username (per assignment requirement)
        post.comments.push({
            userId: req.userId,
            username: user.username,
            text: text.trim()
        });

        await post.save();
        await post.populate('userId', 'username');

        res.json({
            message: 'Comment added successfully',
            post,
            commentsCount: post.comments.length
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Server error while adding comment' });
    }
});

module.exports = router;
