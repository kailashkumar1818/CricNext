import { News } from '../models/News.js';

// @desc    Get all news articles with filtering and pagination
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res, next) => {
  try {
    const { category, tag, search, featured, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top / featured headlines for homepage
// @route   GET /api/news/top
// @access  Public
export const getTopNews = async (req, res, next) => {
  try {
    const topNews = await News.find()
      .sort({ isFeatured: -1, publishedAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      news: topNews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by slug or ID
// @route   GET /api/news/:slugOrId
// @access  Public
export const getNewsBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    let article;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      article = await News.findById(slugOrId);
    } else {
      article = await News.findOne({ slug: slugOrId });
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    // Also fetch related news from same category
    const relatedNews = await News.find({
      category: article.category,
      _id: { $ne: article._id },
    })
      .sort({ publishedAt: -1 })
      .limit(4);

    res.status(200).json({
      success: true,
      article,
      relatedNews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create news article
// @route   POST /api/news
// @access  Private/Admin
export const createNews = async (req, res, next) => {
  try {
    const { title, summary, content, category, imageUrl, tags, isFeatured, author, readTime } = req.body;

    const article = await News.create({
      title,
      summary,
      content,
      category,
      imageUrl: imageUrl || undefined,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [],
      isFeatured: !!isFeatured,
      author: author || req.user?.name || 'Cricbuzz Desk',
      readTime: readTime || '3 min read',
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully',
      article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    let article = await News.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map((t) => t.trim());
    }

    article = await News.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await News.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
