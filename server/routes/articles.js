const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect, admin, optionalAuth } = require('../middleware/auth');

// Get all articles
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 12, featured, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (status) query.status = status;
    else query.status = 'published';
    
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    res.json({ success: true, articles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single article
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'username avatar bio');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    
    // Increment views
    article.views += 1;
    await article.save();
    
    // Related articles
    const related = await Article.find({
      category: article.category,
      _id: { $ne: article._id },
      status: 'published'
    }).populate('author', 'username avatar').limit(4);
    
    res.json({ success: true, article, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create article (admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const article = await Article.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update article (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete article (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Like / dislike
router.post('/:id/like', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Not found' });
    const userId = req.user._id;
    const liked = article.likes.includes(userId);
    if (liked) { article.likes.pull(userId); }
    else { article.likes.push(userId); article.dislikes.pull(userId); }
    await article.save();
    res.json({ success: true, likes: article.likes.length, dislikes: article.dislikes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/dislike', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Not found' });
    const userId = req.user._id;
    const disliked = article.dislikes.includes(userId);
    if (disliked) { article.dislikes.pull(userId); }
    else { article.dislikes.push(userId); article.likes.pull(userId); }
    await article.save();
    res.json({ success: true, likes: article.likes.length, dislikes: article.dislikes.length, disliked: !disliked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Favorites
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const isFav = user.favorites.includes(req.params.id);
    if (isFav) user.favorites.pull(req.params.id);
    else user.favorites.push(req.params.id);
    await user.save();
    res.json({ success: true, isFavorite: !isFav });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
