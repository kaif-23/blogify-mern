const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Blog = require('../models/blog');
const Comment = require('../models/comment');

const router = Router();

// --- Multer config remains the same ---
const uploadDir = path.resolve('./public/uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });
// ----------------------------------------


// GET /api/blog - Get all blogs
router.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({}).populate('createdBy', 'fullName profileImageURL').sort({ createdAt: -1 });
        return res.json(allBlogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({ error: 'Failed to load blogs.' });
    }
});

// GET /api/blog/:id - Get a single blog and its comments
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy', 'fullName profileImageURL');
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found.' });
        }
        const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy', 'fullName profileImageURL');

        return res.json({ blog, comments });
    } catch (error) {
        console.error("Error fetching blog or comments:", error);
        return res.status(500).json({ error: 'Something went wrong while fetching the blog.' });
    }
});

// POST /api/blog/comment/:blogId - Add a new comment
router.post("/comment/:blogId", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Please log in to comment.' });
        }
        const comment = await Comment.create({
            content: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });
        const populatedComment = await Comment.findById(comment._id).populate('createdBy', 'fullName profileImageURL');
        return res.status(201).json(populatedComment);
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ error: 'Failed to add comment.' });
    }
});

// POST /api/blog - Create a new blog post
router.post('/', upload.single('coverImage'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Please log in to create a blog.' });
        }
        const { title, body } = req.body;
        if (!title || !body || !req.file) {
            return res.status(400).json({ error: 'Title, body, and cover image are required.' });
        }
        const blog = await Blog.create({
            body,
            title,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`,
        });
        return res.status(201).json(blog);
    } catch (error) {
        console.error("Error creating new blog:", error);
        return res.status(500).json({ error: 'Failed to create blog.' });
    }
});

// POST /api/blog/edit/:id - Update a blog post
router.post('/edit/:id', upload.single('coverImage'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Please log in to update blogs.' });
        }
        const blogId = req.params.id;
        const { title, body } = req.body;
        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({ error: 'Blog not found.' });
        }
        if (existingBlog.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized.' });
        }

        const updateData = { title, body };
        if (req.file) {
            updateData.coverImageURL = `/uploads/${req.file.filename}`;
            // Optional: Delete old image
            if (existingBlog.coverImageURL) {
                fs.unlink(path.resolve('./public', existingBlog.coverImageURL), (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }
        }
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { $set: updateData }, { new: true });
        return res.json(updatedBlog);
    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({ error: 'Failed to update blog.' });
    }
});

// POST /api/blog/delete/:id - Delete a blog post (using POST for simplicity from client)
router.post('/delete/:id', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Please log in to delete blogs.' });
        }
        const blogId = req.params.id;
        const blogToDelete = await Blog.findById(blogId);
        if (!blogToDelete) {
            return res.status(404).json({ error: 'Blog not found.' });
        }
        if (blogToDelete.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized.' });
        }

        // Optional: Delete image
        if (blogToDelete.coverImageURL) {
            fs.unlink(path.resolve('./public', blogToDelete.coverImageURL), (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }
        await Comment.deleteMany({ blogId: blogId });
        await Blog.findByIdAndDelete(blogId);

        return res.json({ message: 'Blog deleted successfully.' });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ error: 'Failed to delete blog.' });
    }
});

module.exports = router;