require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Bypass local ISP DNS blocking for MongoDB SRV records
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');

// ==========================================
// SCHEMAS
// ==========================================

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  subcategory: String,
  price: Number,
  image: String,
  description: String,
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 5.0 },
  isSellerListing: { type: Boolean, default: false }
});

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  description: String,
  image: String
});

const cartSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  quantity: { type: Number, default: 1 }
});

const wishlistSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true }
});

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

// ==========================================
// MODELS
// ==========================================

const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);
const Cart = mongoose.model('Cart', cartSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Subscriber = mongoose.model('Subscriber', subscriberSchema);
const User = mongoose.model('User', userSchema);

// ==========================================
// SEED DATA
// ==========================================

const initialProducts = [
  { id: "prod-1",  name: "Heavyweight Studio Tee",        category: "Men",   subcategory: "T-Shirts",  price: 120, image: "./all photos/heavyweight_tee.png",      description: "100% Organic 300GSM combed cotton tee with relaxed drop-shoulder boxy fit.",                    inStock: true, rating: 4.9 },
  { id: "prod-2",  name: "Deconstructed Utility Jacket",  category: "Men",   subcategory: "Outerwear", price: 480, image: "./all photos/utility_jacket_olive.png",  description: "Technical nylon ripstop jacket featuring multi-pocket configuration and industrial hardware.",   inStock: true, rating: 4.8 },
  { id: "prod-3",  name: "Archival French Terry Hoodie",  category: "Men",   subcategory: "Hoodies",   price: 240, image: "./all photos/men_terry_hoodie.png",       description: "Custom sun-washed vintage wash heavy loopback French terry overhead hoodie.",                   inStock: true, rating: 5.0 },
  { id: "prod-4",  name: "Pleated Wide Trousers",         category: "Women", subcategory: "Jeans",     price: 310, image: "./all photos/trouser.jpg",               description: "High-waisted double pleated Japanese wool crepe wide leg tailored trousers.",                  inStock: true, rating: 4.7 },
  { id: "prod-5",  name: "Minimalist Monochrome Blazer",  category: "Women", subcategory: "Outerwear", price: 520, image: "./all photos/blazer_new.png",             description: "Structured sharp silhouette single-breasted blazer in virgin wool blend.",                    inStock: true, rating: 4.9 },
  { id: "prod-6",  name: "Kids Oversized Street Hoodie",  category: "Kids",  subcategory: "Hoodies",   price: 110, image: "./all photos/kids_hoodie_color.png",      description: "Soft brushed fleece kids hoodie with ribbed cuffs and understated embroidery.",                inStock: true, rating: 4.9 },
  { id: "prod-7",  name: "Tailored Overcoat",             category: "Men",   subcategory: "Outerwear", price: 640, image: "./all photos/overcoat_new.png",           description: "Heavy wool blend longline overcoat with lapel collar and satin lining.",                      inStock: true, rating: 5.0 },
  { id: "prod-8",  name: "Editorial Tech Trench Coat",    category: "Women", subcategory: "Outerwear", price: 590, image: "./all photos/women_trench_coat.png",      description: "Water-resistant coated cotton trench coat with asymmetrical storm flap.",                     inStock: true, rating: 4.8 },
  { id: "prod-9",  name: "Vintage Wash Black Jeans",      category: "Men",   subcategory: "Jeans",     price: 210, image: "./all photos/black_jeans.png",            description: "Straight fit faded black denim jeans with distressed details and signature hardware.",        inStock: true, rating: 4.6 },
  { id: "prod-10", name: "Asymmetric Knit Sweater",       category: "Women", subcategory: "Tops",      price: 380, image: "./all photos/women_knit_sweater.png",     description: "Chunky wool blend sweater featuring an asymmetric hem and oversized collar.",                 inStock: true, rating: 4.9 },
  { id: "prod-11", name: "Kids Colorblock Puffer",        category: "Kids",  subcategory: "Outerwear", price: 145, image: "./all photos/kids_puffer_red.png",        description: "Insulated puffer jacket with bold color blocking and fleece-lined pockets.",                  inStock: true, rating: 4.8 },
  { id: "prod-12", name: "Men Black Denim Shorts",        category: "Men",   subcategory: "Shorts",    price: 95,  image: "./all photos/black_denim_shorts.png",     description: "Stylish cutoff vintage black denim shorts.",                                                  inStock: true, rating: 4.5 },
  { id: "prod-13", name: "Kids Charcoal Overalls",        category: "Kids",  subcategory: "Pants",     price: 85,  image: "./all photos/charcoal_overalls.png",      description: "Durable and stylish charcoal grey overalls for kids.",                                        inStock: true, rating: 4.7 },
  { id: "prod-14", name: "Kids Graphic Tee",              category: "Kids",  subcategory: "T-Shirts",  price: 35,  image: "./all photos/kids_graphic_tee.png",       description: "Soft organic cotton graphic tee with a fun, vibrant print.",                                  inStock: true, rating: 4.8 }
];

const initialCategories = [
  { id: 'men',   name: 'Men',   description: 'Tailored essentials, outerwear & footwear.',          image: './all photos/chico.jpg' },
  { id: 'women', name: 'Women', description: 'Minimalist silhouettes & modern tailoring.',           image: './all photos/women_fashion_bw.png' },
  { id: 'kids',  name: 'Kids',  description: 'Contemporary comfort for the next generation.',        image: './all photos/kids_fashion_bw_new.png' }
];

// ==========================================
// DB INIT
// ==========================================

async function initDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas successfully.');

  // Always re-seed products with correct image paths
  await Product.deleteMany({});
  await Product.insertMany(initialProducts);
  console.log('Seeded products with correct image paths.');

  // Seed categories if empty
  await Category.deleteMany({});
  await Category.insertMany(initialCategories);
  console.log('Seeded categories.');
}


// ==========================================
// STORE (DATA ACCESS LAYER)
// ==========================================

const store = {
  getProducts: async (category, subcategory, search, sort) => {
    const query = {};
    if (category && category.toLowerCase() !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }
    if (subcategory) {
      query.subcategory = new RegExp(`^${subcategory}$`, 'i');
    }
    if (search && search.trim() !== '') {
      const q = new RegExp(search.trim(), 'i');
      query.$or = [{ name: q }, { description: q }];
    }

    let sortObj = {};
    if (sort === 'price-low') sortObj = { price: 1 };
    else if (sort === 'price-high') sortObj = { price: -1 };

    return await Product.find(query).sort(sortObj).lean();
  },

  getProductById: async (id) => {
    return await Product.findOne({ id }).lean();
  },

  getCategories: async () => {
    return await Category.find().lean();
  },

  getCart: async () => {
    const cartItems = await Cart.find().lean();
    const productIds = cartItems.map(c => c.productId);
    const products = await Product.find({ id: { $in: productIds } }).lean();
    const productMap = {};
    products.forEach(p => { productMap[p.id] = p; });

    let subtotal = 0;
    let itemCount = 0;
    const cart = cartItems.map(item => {
      const product = productMap[item.productId];
      if (!product) return null;
      subtotal += product.price * item.quantity;
      itemCount += item.quantity;
      return { ...product, quantity: item.quantity };
    }).filter(Boolean);

    return { cart, itemCount, subtotal: subtotal.toFixed(2) };
  },

  addToCart: async (productId, quantity = 1) => {
    const product = await store.getProductById(productId);
    if (!product) return null;
    const existing = await Cart.findOne({ productId });
    if (existing) {
      await Cart.updateOne({ productId }, { $inc: { quantity } });
    } else {
      await Cart.create({ productId, quantity });
    }
    return product;
  },

  updateCartQuantity: async (productId, quantity) => {
    const existing = await Cart.findOne({ productId });
    if (!existing) return false;
    if (quantity <= 0) {
      await Cart.deleteOne({ productId });
    } else {
      await Cart.updateOne({ productId }, { $set: { quantity } });
    }
    return true;
  },

  removeFromCart: async (productId) => {
    await Cart.deleteOne({ productId });
    return true;
  },

  getWishlist: async () => {
    const items = await Wishlist.find().lean();
    return items.map(i => i.productId);
  },

  toggleWishlist: async (productId) => {
    const existing = await Wishlist.findOne({ productId });
    let isWishlisted = false;
    if (existing) {
      await Wishlist.deleteOne({ productId });
    } else {
      await Wishlist.create({ productId });
      isWishlisted = true;
    }
    const count = await Wishlist.countDocuments();
    return { isWishlisted, count };
  },

  addListing: async (itemData) => {
    const newProd = {
      id: 'prod-' + Date.now(),
      name: itemData.title || itemData.name || 'Custom Item',
      category: itemData.category || 'Men',
      subcategory: null,
      price: parseFloat(itemData.price || itemData.estimatedValue || 150),
      image: itemData.image || './all photos/',
      description: itemData.description || 'High fashion piece in mint condition.',
      inStock: true,
      rating: 5.0,
      isSellerListing: true
    };
    await Product.create(newProd);
    return newProd;
  },

  addSubscriber: async (email) => {
    try {
      await Subscriber.create({ email });
      return true;
    } catch (err) {
      return false; // duplicate
    }
  },

  // ===== USER AUTH =====
  registerUser: async (email, name, password) => {
    const existing = await User.findOne({ email });
    if (existing) return { success: false, message: 'An account with this email already exists.' };
    await User.create({ email, name, password });
    return { success: true, name };
  },

  loginUser: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return { success: false, message: 'Account not found. Please create an account first.' };
    if (user.password !== password) return { success: false, message: 'Incorrect password. Please try again.' };
    return { success: true, name: user.name };
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Vercel Serverless Database Connection Middleware
let isDbConnected = false;
app.use(async (req, res, next) => {
  if (!isDbConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      isDbConnected = true;
    } catch (err) {
      console.error('Failed to connect to MongoDB in Serverless context:', err);
    }
  }
  next();
});

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/categories', async (req, res) => {
  const categories = await store.getCategories();
  res.json({ success: true, categories });
});

app.get(['/api/products', '/api/listings'], async (req, res) => {
  const { category, subcategory, search, sort } = req.query;
  const filtered = await store.getProducts(category, subcategory, search, sort);
  res.json({ success: true, total: filtered.length, products: filtered, listings: filtered });
});

app.get(['/api/products/:id', '/api/listings/:id'], async (req, res) => {
  const product = await store.getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

app.get('/api/cart', async (req, res) => {
  const cartData = await store.getCart();
  res.json({ success: true, ...cartData });
});

app.post('/api/cart', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await store.addToCart(productId, quantity);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const cartData = await store.getCart();
  res.json({ success: true, message: `${product.name} added to cart!`, ...cartData });
});

app.put('/api/cart/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const updated = await store.updateCartQuantity(id, quantity);
  if (!updated) return res.status(404).json({ success: false, message: 'Cart item not found' });
  const cartData = await store.getCart();
  res.json({ success: true, ...cartData });
});

app.delete('/api/cart/:id', async (req, res) => {
  await store.removeFromCart(req.params.id);
  const cartData = await store.getCart();
  res.json({ success: true, message: 'Item removed from cart', ...cartData });
});

app.get('/api/wishlist', async (req, res) => {
  const items = await store.getWishlist();
  res.json({ success: true, count: items.length, items });
});

app.post('/api/wishlist/toggle', async (req, res) => {
  const { productId } = req.body;
  const result = await store.toggleWishlist(productId);
  res.json({
    success: true,
    isWishlisted: result.isWishlisted,
    count: result.count,
    message: result.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist'
  });
});

app.post(['/api/sell', '/api/listings'], async (req, res) => {
  const newProd = await store.addListing(req.body);
  res.json({ success: true, message: 'Listing submitted for verification & added to shop feed!', listing: newProd });
});

app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }
  await store.addSubscriber(email);
  res.json({ success: true, message: 'Successfully subscribed to Archive drop alerts!' });
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.post('/api/register', async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ success: false, message: 'Email, name, and password are required.' });
  }
  const result = await store.registerUser(email, name, password);
  if (!result.success) return res.status(409).json(result);
  res.json(result);
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  const result = await store.loginUser(email, password);
  if (!result.success) return res.status(401).json(result);
  res.json(result);
});

// ==========================================
// FRONTEND ROUTE
// ==========================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server (Local Development)
if (process.env.NODE_ENV !== 'production') {
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`================================================`);
      console.log(`  ARCHIVE Backend Running on MongoDB!`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log(`================================================`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
