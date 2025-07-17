const Product = require('../models/Product');
const { createNotification } = require('./notifications');

// @desc    Get all products with filtering, search and sorting
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      brand,
      targetGender,
      category,
      subcategory,
      stockStatus,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtering
    if (brand) query.brand = brand;
    if (targetGender) query.targetGender = targetGender;
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    // Stock status filtering
    if (stockStatus === 'in-stock') {
      query['stock.quantity'] = { $gt: 0 };
    } else if (stockStatus === 'out-of-stock') {
      query['stock.quantity'] = 0;
    } else if (stockStatus === 'low-stock') {
      query['stock.quantity'] = { $lte: 5, $gt: 0 };
    }

    // Build sort object
    let sortObj = {};
    if (sort && sort.includes(':')) {
      // Support 'field:direction' format
      const [field, direction] = sort.split(':');
      sortObj[field] = direction === 'desc' ? -1 : 1;
    } else if (sort === 'price-low') {
      sortObj.price = 1;
    } else if (sort === 'price-high') {
      sortObj.price = -1;
    } else if (sort === 'newest') {
      sortObj.createdAt = -1;
    } else if (sort === 'popular') {
      sortObj['rating.average'] = -1;
    } else {
      sortObj.createdAt = -1; // Default sort
    }

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('category')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.max(1, Math.ceil(total / limit))
      },
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const oldStock = product.stock.quantity;
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Check for low stock notification
    if (product.stock.quantity <= product.stock.lowStockThreshold && 
        product.stock.quantity > 0 && 
        oldStock > product.stock.lowStockThreshold) {
      await createNotification(
        'low-stock',
        'Low Stock Alert',
        `${product.name} is running low on stock (${product.stock.quantity} items left)`,
        { productId: product._id }
      );
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 