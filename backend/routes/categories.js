const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categories');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCategories);

router.get('/:id', getCategory);

router.post('/', protect, authorize('admin'), createCategory);

router.put('/:id', protect, authorize('admin'), updateCategory);

router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router; 