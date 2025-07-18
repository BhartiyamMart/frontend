
// Mock data for categories, subcategories, and products
export const categories = [
  { id: '1', name: 'Fruits & Vegetables' },
  { id: '2', name: 'Dairy & Bakery' },
  { id: '3', name: 'Snacks & Beverages' },
  { id: '4', name: 'Personal Care' },
  { id: '5', name: 'Household Items' }
];

export const subCategories = [
  { id: '1', name: 'Fresh Fruits', categoryId: '1' },
  { id: '2', name: 'Fresh Vegetables', categoryId: '1' },
  { id: '3', name: 'Milk & Yogurt', categoryId: '2' },
  { id: '4', name: 'Bread & Bakery', categoryId: '2' },
  { id: '5', name: 'Chips & Snacks', categoryId: '3' },
  { id: '6', name: 'Cold Drinks', categoryId: '3' },
  { id: '7', name: 'Bath & Body', categoryId: '4' },
  { id: '8', name: 'Oral Care', categoryId: '4' },
  { id: '9', name: 'Cleaning Supplies', categoryId: '5' },
  { id: '10', name: 'Kitchen Items', categoryId: '5' }
];

export const mockProducts = [
  {
    id: '1',
    name: 'Fresh Bananas',
    sku: 'FRT001',
    HSN_code: '08030010',
    photos: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'],
    GST: 0,
    expiry_date: '2024-01-15',
    product_description: 'Fresh yellow bananas, rich in potassium and perfect for breakfast',
    product_brand: 'FreshMart',
    MRP: 60,
    purchase_price: 40,
    selling_price: 55,
    category: '1',
    sub_category: '1'
  },
  {
    id: '2',
    name: 'Organic Apples',
    sku: 'FRT002',
    HSN_code: '08081000',
    photos: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'],
    GST: 0,
    expiry_date: '2024-01-20',
    product_description: 'Crisp and juicy organic apples, perfect for healthy snacking',
    product_brand: 'OrganicFresh',
    MRP: 180,
    purchase_price: 140,
    selling_price: 165,
    category: '1',
    sub_category: '1'
  },
  {
    id: '3',
    name: 'Fresh Tomatoes',
    sku: 'VEG001',
    HSN_code: '07020000',
    photos: ['https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400'],
    GST: 0,
    expiry_date: '2024-01-12',
    product_description: 'Fresh red tomatoes, perfect for cooking and salads',
    product_brand: 'VeggieFresh',
    MRP: 40,
    purchase_price: 25,
    selling_price: 35,
    category: '1',
    sub_category: '2'
  },
  {
    id: '4',
    name: 'Amul Fresh Milk',
    sku: 'DRY001',
    HSN_code: '04011000',
    photos: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'],
    GST: 5,
    expiry_date: '2024-01-10',
    product_description: 'Fresh full cream milk from Amul, 500ml pack',
    product_brand: 'Amul',
    MRP: 30,
    purchase_price: 25,
    selling_price: 28,
    category: '2',
    sub_category: '3'
  },
  {
    id: '5',
    name: 'Britannia Bread',
    sku: 'BKY001',
    HSN_code: '19059020',
    photos: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'],
    GST: 5,
    expiry_date: '2024-01-08',
    product_description: 'Soft white bread loaf from Britannia, perfect for breakfast',
    product_brand: 'Britannia',
    MRP: 25,
    purchase_price: 20,
    selling_price: 23,
    category: '2',
    sub_category: '4'
  },
  {
    id: '6',
    name: 'Lays Classic Chips',
    sku: 'SNK001',
    HSN_code: '20052000',
    photos: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'],
    GST: 12,
    expiry_date: '2024-03-15',
    product_description: 'Crispy potato chips with classic salted flavor, 50g pack',
    product_brand: 'Lays',
    MRP: 20,
    purchase_price: 15,
    selling_price: 18,
    category: '3',
    sub_category: '5'
  },
  {
    id: '7',
    name: 'Coca Cola',
    sku: 'BEV001',
    HSN_code: '22021000',
    photos: ['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'],
    GST: 28,
    expiry_date: '2024-06-30',
    product_description: 'Refreshing Coca Cola soft drink, 330ml can',
    product_brand: 'Coca Cola',
    MRP: 40,
    purchase_price: 30,
    selling_price: 36,
    category: '3',
    sub_category: '6'
  },
  {
    id: '8',
    name: 'Dove Soap',
    sku: 'PC001',
    HSN_code: '34011100',
    photos: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
    GST: 18,
    expiry_date: '2025-12-31',
    product_description: 'Moisturizing beauty bar with 1/4 moisturizing cream',
    product_brand: 'Dove',
    MRP: 45,
    purchase_price: 35,
    selling_price: 42,
    category: '4',
    sub_category: '7'
  }
];

// Storage keys
export const STORAGE_KEYS = {
  PRODUCTS: 'zeptomart_products',
  CATEGORIES: 'zeptomart_categories',
  SUBCATEGORIES: 'zeptomart_subcategories'
};

// Initialize localStorage with mock data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBCATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.SUBCATEGORIES, JSON.stringify(subCategories));
  }
};
