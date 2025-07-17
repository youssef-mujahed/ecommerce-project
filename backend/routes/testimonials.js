const express = require('express');
const router = express.Router();
const { 
  getProductTestimonials, 
  createTestimonial, 
  getAllTestimonials, 
  updateTestimonial, 
  deleteTestimonial 
} = require('../controllers/testimonials');
const { protect, authorize } = require('../middleware/auth');

router.get('/product/:productId', getProductTestimonials);

router.post('/', protect, createTestimonial);

router.get('/', protect, authorize('admin'), getAllTestimonials);

router.put('/:id', protect, authorize('admin'), updateTestimonial);

router.delete('/:id', protect, authorize('admin'), deleteTestimonial);

module.exports = router; 