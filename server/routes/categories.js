const express = require('express');
const catRouter = express.Router();
const searchRouter = express.Router();
const Article = require('../models/Article');

catRouter.get('/', async (req, res) => {
  try {
    const categories = await Article.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

searchRouter.get('/', async (req, res) => {
  try {
    const { q, category, page = 1, limit = 10 } = req.query;
    if (!q) return res.json({ success: true, articles: [], total: 0 });
    const query = {
      status: 'published',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };
    if (category) query.category = category;
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, articles, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = { catRouter, searchRouter };
