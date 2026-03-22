const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect, admin } = require('../middleware/auth');

router.get('/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { articleId, content } = req.body;
    const comment = await Comment.create({ article: articleId, author: req.user._id, content });
    await comment.populate('author', 'username avatar');
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Not found' });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });
    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const liked = comment.likes.includes(req.user._id);
    if (liked) comment.likes.pull(req.user._id);
    else comment.likes.push(req.user._id);
    await comment.save();
    res.json({ success: true, likes: comment.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
