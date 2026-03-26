/**
 * Seed script to populate the database with sample data
 * Run: node utils/seed.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Drop = require('../models/Drop');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/men-amman';

const sampleUsers = [
  { name: 'Lina Haddad', email: 'lina@test.com', password: 'password123', role: 'seller', neighborhood: 'Jabal Amman' },
  { name: 'Omar Khalil', email: 'omar@test.com', password: 'password123', role: 'seller', neighborhood: 'Rainbow Street' },
  { name: 'Sara Nasser', email: 'sara@test.com', password: 'password123', role: 'seller', neighborhood: 'Sweifieh' },
  { name: 'Ahmad Buyer', email: 'ahmad@test.com', password: 'password123', role: 'buyer', neighborhood: 'Abdoun' },
  { name: 'Nour Shopper', email: 'nour@test.com', password: 'password123', role: 'buyer', neighborhood: 'Shmeisani' },
];

const sampleShops = [
  {
    name: 'Lina\'s Leather',
    nameAr: 'جلود لينا',
    description: 'Handcrafted leather bags and accessories made with love in downtown Amman. Every piece tells a story.',
    category: 'Handmade',
    neighborhood: 'Jabal Amman',
    instagram: '@linasleather',
    whatsapp: '+96279000001',
    culturalTags: ['Made in Amman', 'Handcrafted', 'Support local'],
    profileImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
  },
  {
    name: 'Omar\'s Kitchen',
    nameAr: 'مطبخ عمر',
    description: 'Home-cooked Jordanian food delivered fresh. Family recipes passed down for generations.',
    category: 'Food',
    neighborhood: 'Rainbow Street',
    instagram: '@omarskitchen',
    whatsapp: '+96279000002',
    culturalTags: ['From my home', 'Family recipe', 'Support local'],
    profileImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  },
  {
    name: 'Sara Designs',
    nameAr: 'تصاميم سارة',
    description: 'Contemporary Jordanian fashion with a twist. Streetwear meets Middle Eastern heritage.',
    category: 'Fashion',
    neighborhood: 'Sweifieh',
    instagram: '@saradesigns',
    whatsapp: '+96279000003',
    culturalTags: ['Made in Amman', 'Support local'],
    profileImage: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  },
];

const sampleProducts = [
  // Lina's Leather products
  { name: 'Classic Tote Bag', nameAr: 'حقيبة توت كلاسيكية', description: 'Hand-stitched leather tote, perfect for everyday use. Made from genuine Jordanian leather.', price: 45, category: 'Handmade', vibeTag: 'Handmade', culturalTags: ['Made in Amman', 'Handcrafted'], images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'], allowOffers: true, allowCustomOrders: true },
  { name: 'Crossbody Satchel', nameAr: 'حقيبة كروس', description: 'Compact crossbody bag with brass buckle. Every stitch done by hand.', price: 35, category: 'Handmade', vibeTag: 'Vintage', culturalTags: ['Handcrafted'], images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'], allowOffers: true },
  { name: 'Leather Wallet', nameAr: 'محفظة جلد', description: 'Slim leather wallet with card slots. Minimalist design, maximum durability.', price: 15, category: 'Handmade', vibeTag: 'Modern', culturalTags: ['Made in Amman'], images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'] },
  { name: 'Desert Backpack', nameAr: 'حقيبة ظهر', description: 'Rugged leather backpack inspired by Wadi Rum adventures.', price: 65, category: 'Handmade', vibeTag: 'Vintage', culturalTags: ['Made in Amman', 'Handcrafted'], images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'], allowOffers: true, allowCustomOrders: true },

  // Omar's Kitchen products
  { name: 'Mansaf Platter', nameAr: 'طبق منسف', description: 'Traditional Jordanian mansaf for 4 people. Lamb, jameed, rice — the real deal.', price: 25, category: 'Food', vibeTag: 'Home food', culturalTags: ['Family recipe', 'From my home'], images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600'], allowCustomOrders: true },
  { name: 'Knafeh Box', nameAr: 'صندوق كنافة', description: 'Fresh Nabulsi knafeh made every morning. Sweet, cheesy perfection.', price: 8, category: 'Food', vibeTag: 'Home food', culturalTags: ['From my home'], images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600'] },
  { name: 'Falafel Catering', nameAr: 'تموين فلافل', description: 'Fresh falafel catering for events. Crispy outside, fluffy inside.', price: 30, category: 'Food', vibeTag: 'Home food', culturalTags: ['Family recipe', 'Support local'], images: ['https://images.unsplash.com/photo-1593001874117-c99c800e3eb6?w=600'], allowCustomOrders: true },

  // Sara Designs products
  { name: 'Amman Streetwear Hoodie', nameAr: 'هودي شوارع عمان', description: 'Limited edition hoodie with Arabic calligraphy. "من عمان" printed in gold.', price: 40, category: 'Fashion', vibeTag: 'Streetwear', culturalTags: ['Made in Amman'], images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'], isDrop: true, isLimited: true },
  { name: 'Heritage Scarf', nameAr: 'شال تراثي', description: 'Modern take on the traditional keffiyeh. Lightweight cotton blend.', price: 20, category: 'Fashion', vibeTag: 'Traditional', culturalTags: ['Made in Amman', 'Support local'], images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600'], allowOffers: true },
  { name: 'Minimalist Abaya', nameAr: 'عباية بسيطة', description: 'Clean-cut modern abaya with subtle embroidery details.', price: 55, category: 'Fashion', vibeTag: 'Modern', culturalTags: ['Made in Amman', 'Handcrafted'], images: ['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600'], allowOffers: true, allowCustomOrders: true },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Drop.deleteMany({});

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      users.push(user);
    }
    console.log(`Created ${users.length} users`);

    // Create shops (first 3 users are sellers)
    const shops = [];
    for (let i = 0; i < 3; i++) {
      const shop = await Shop.create({ ...sampleShops[i], owner: users[i]._id });
      shops.push(shop);
    }
    console.log(`Created ${shops.length} shops`);

    // Create products
    const productGroups = [
      sampleProducts.slice(0, 4),  // Lina's products
      sampleProducts.slice(4, 7),  // Omar's products
      sampleProducts.slice(7, 10), // Sara's products
    ];

    let productCount = 0;
    for (let i = 0; i < 3; i++) {
      for (const productData of productGroups[i]) {
        await Product.create({
          ...productData,
          shop: shops[i]._id,
          seller: users[i]._id,
        });
        productCount++;
      }
    }
    console.log(`Created ${productCount} products`);

    // Create a drop
    const dropProducts = await Product.find({ isDrop: true });
    await Drop.create({
      shop: shops[2]._id,
      seller: users[2]._id,
      title: 'Amman Street Collection Drop',
      description: 'Limited edition streetwear inspired by the streets of Amman. Get them before they\'re gone!',
      dropType: 'limited_items',
      products: dropProducts.map(p => p._id),
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    });
    console.log('Created sample drop');

    console.log('\nSeed completed successfully!');
    console.log('\nTest accounts:');
    console.log('  Seller: lina@test.com / password123');
    console.log('  Seller: omar@test.com / password123');
    console.log('  Seller: sara@test.com / password123');
    console.log('  Buyer:  ahmad@test.com / password123');
    console.log('  Buyer:  nour@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
