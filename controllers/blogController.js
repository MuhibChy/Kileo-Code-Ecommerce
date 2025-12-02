const Blog = require('../models/Blog');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find({ isPublished: true })
    .populate('author', 'name avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'name avatar');

  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  // Increment views if not admin
  if (req.user?.role !== 'admin') {
    blog.views += 1;
    await blog.save();
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;

  const blog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    data: blog
  });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
exports.updateBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  await blog.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like blog
// @route   POST /api/blogs/:id/like
// @access  Private
exports.likeBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  // Check if user already liked
  if (blog.likes.includes(req.user.id)) {
    return next(new ErrorResponse('You have already liked this blog', 400));
  }

  blog.likes.push(req.user.id);
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Unlike blog
// @route   DELETE /api/blogs/:id/like
// @access  Private
exports.unlikeBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  // Remove user from likes
  blog.likes = blog.likes.filter(like => like.toString() !== req.user.id);
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
exports.getFeaturedBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find({
    isPublished: true,
    isFeatured: true
  })
    .populate('author', 'name avatar')
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// @desc    Get blogs by category
// @route   GET /api/blogs/category/:category
// @access  Public
exports.getBlogsByCategory = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find({
    isPublished: true,
    category: req.params.category
  })
    .populate('author', 'name avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});