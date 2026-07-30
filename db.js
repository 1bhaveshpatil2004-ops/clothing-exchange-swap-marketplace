require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Bypass local ISP DNS blocking for MongoDB SRV records
const mongoose = require('mongoose');

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
  { id: "prod-1", name: "Heavyweight Studio Tee", category: "Men", subcategory: "T-Shirts", price: 120, image: "./all photos/", description: "100% Organic 300GSM combed cotton tee with relaxed drop-shoulder boxy fit.", inStock: true, rating: 4.9 },
  { id: "prod-2", name: "Deconstructed Utility Jacket", category: "Men", subcategory: "Outerwear", price: 480, image: "./all photos/", description: "Technical nylon ripstop jacket featuring multi-pocket configuration and industrial hardware.", inStock: true, rating: 4.8 },
  { id: 'prod-3', name: 'Archival French Terry Hoodie', category: 'Men', subcategory: 'Hoodies', price: 240, image: './all photos/', description: 'Custom sun-washed vintage wash heavy loopback French terry overhead hoodie.', inStock: true, rating: 5.0 },
  { id: "prod-4", name: "Pleated Wide Trousers", category: "Women", subcategory: "Jeans", price: 310, image: "./all photos/", description: "High-waisted double pleated Japanese wool crepe wide leg tailored trousers.", inStock: true, rating: 4.7 },
  { id: "prod-5", name: "Minimalist Monochrome Blazer", category: "Women", subcategory: "Outerwear", price: 520, image: "./all photos/", description: "Structured sharp silhouette single-breasted blazer in virgin wool blend.", inStock: true, rating: 4.9 },
  { id: "prod-6", name: "Kids Oversized Street Hoodie", category: "Kids", subcategory: "Hoodies", price: 110, image: "./all photos/", description: "Soft brushed fleece kids hoodie with ribbed cuffs and understated embroidery.", inStock: true, rating: 4.9 },
  { id: "prod-7", name: "Tailored Overcoat", category: "Men", subcategory: "Outerwear", price: 640, image: "./all photos/", description: "Heavy wool blend longline overcoat with lapel collar and satin lining.", inStock: true, rating: 5 },
  { id: "prod-8", name: "Editorial Tech Trench Coat", category: "Women", subcategory: "Outerwear", price: 590, image: "./all photos/", description: "Water-resistant coated cotton trench coat with asymmetrical storm flap.", inStock: true, rating: 4.8 },
  { id: "prod-9", name: "Vintage Wash Black Jeans", category: "Men", subcategory: "Jeans", price: 210, image: "./all photos/", description: "Straight fit faded black denim jeans with distressed details and signature hardware.", inStock: true, rating: 4.6 },
  { id: 'prod-10', name: 'Asymmetric Knit Sweater', category: 'Women', subcategory: 'Tops', price: 380, image: './all photos/', description: 'Chunky wool blend sweater featuring an asymmetric hem and oversized collar.', inStock: true, rating: 4.9 },
  { id: "prod-11", name: "Kids Colorblock Puffer", category: "Kids", subcategory: "Outerwear", price: 145, image: "./all photos/", description: "Insulated puffer jacket with bold color blocking and fleece-lined pockets.", inStock: true, rating: 4.8 },
  { id: "prod-12", name: "Men Black Denim Shorts", category: "Men", subcategory: "Shorts", price: 95, image: "./all photos/", description: "Stylish cutoff vintage black denim shorts.", inStock: true, rating: 4.5 },
  { id: "prod-13", name: "Kids Charcoal Overalls", category: "Kids", subcategory: "Pants", price: 85, image: "./all photos/", description: "Durable and stylish charcoal grey overalls for kids.", inStock: true, rating: 4.7 },
  { id: "prod-14", name: "Kids Graphic Tee", category: "Kids", subcategory: "T-Shirts", price: 35, image: "./all photos/", description: "Soft organic cotton graphic tee with a fun, vibrant print.", inStock: true, rating: 4.8 }
];

const initialCategories = [
  { id: 'men', name: 'Men', description: 'Tailored essentials, outerwear & footwear.', image: './all photos/' },
  { id: 'women', name: 'Women', description: 'Minimalist silhouettes & modern tailoring.', image: './all photos/' },
  { id: 'kids', name: 'Kids', description: 'Contemporary comfort for the next generation.', image: './all photos/' }
];

// ==========================================
// DB INIT
// ==========================================

async function initDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas successfully.');

  // Seed products if empty
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(initialProducts);
    console.log('Seeded initial products.');
  }

  // Seed categories if empty
  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    await Category.insertMany(initialCategories);
    console.log('Seeded initial categories.');
  }
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

module.exports = { initDB, store };
