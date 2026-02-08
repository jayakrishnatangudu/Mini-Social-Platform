const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true,
        maxlength: [1000, 'Post content cannot exceed 1000 characters']
    },
    image: {
        type: String,
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('Post', postSchema);
