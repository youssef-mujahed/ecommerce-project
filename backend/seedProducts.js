const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Sony', 'Lenovo', 'Asus', 'Acer'];
const categories = [
  { name: 'Laptops', description: 'Portable computers' },
  { name: 'Smartphones', description: 'Mobile phones' },
  { name: 'Accessories', description: 'Tech accessories' },
  { name: 'Gaming', description: 'Gaming devices' }
];
const subcategories = ['Ultrabook', 'Gaming', 'Business', 'Flagship', 'Budget', 'Wireless', 'Wired'];
const tags = ['new', 'sale', 'popular', 'limited', 'exclusive', 'bestseller'];
const genders = ['men', 'women', 'unisex'];

const productImageLinks = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1515548212235-6dbb1ae9b82b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80'
];

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCategoryImages(category, i) {
  const links = categoryImageLinks[category] || productImageLinks;
  // Pick 2 images, first is primary
  return [
    {
      url: links[i % links.length] || PLACEHOLDER_IMAGE,
      alt: `${category} product image 1`,
      isPrimary: true
    },
    {
      url: links[(i+1) % links.length] || PLACEHOLDER_IMAGE,
      alt: `${category} product image 2`,
      isPrimary: false
    }
  ];
}

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/tech-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Remove all existing products
  await Product.deleteMany({});

  // Ensure categories exist and get their ObjectIds
  const categoryDocs = {};
  for (const cat of categories) {
    let doc = await Category.findOne({ name: cat.name });
    if (!doc) {
      doc = await Category.create(cat);
    }
    categoryDocs[cat.name] = doc._id;
  }

  const products = [];
  for (let i = 1; i <= 40; i++) {
    const price = Math.floor(Math.random() * 1000) + 100;
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0;
    const discountedPrice = discount ? Math.round(price * (1 - discount / 100)) : price;
    const stock = Math.floor(Math.random() * 100) + 1;
    const rating = {
      average: (Math.random() * 5).toFixed(1),
      count: Math.floor(Math.random() * 200)
    };
    const catName = randomFrom(categories).name;
    products.push({
      name: `Product ${i}`,
      brand: randomFrom(brands),
      category: categoryDocs[catName],
      subcategory: randomFrom(subcategories),
      description: `This is a description for Product ${i}.`,
      price,
      discountedPrice,
      discount,
      images: getCategoryImages(catName, i),
      stock: { quantity: stock },
      stockStatus: stock > 10 ? 'in-stock' : 'low-stock',
      rating,
      sku: `SKU${1000 + i}`,
      targetGender: randomFrom(genders),
      tags: [randomFrom(tags), randomFrom(tags)],
    });
  }

  await Product.insertMany(products);
  console.log('Seeded 40 random products!');
  mongoose.disconnect();
}

seed(); 