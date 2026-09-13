export const INITIAL_USER = {
  id: 'u1',
  name: 'Rohan',
  phone: '+91 9876543210',
  email: 'rohan@example.com',
};

export const INITIAL_ADDRESSES = [
  { id: 'a1', label: 'Home', fullAddress: '123, Sector 4, Vaishali Nagar, Jaipur', isDefault: true },
  { id: 'a2', label: 'Office', fullAddress: '45, Business Park, Malviya Nagar, Jaipur', isDefault: false },
];

export const INITIAL_CATEGORIES = [
  { id: '1', name: 'Fruits &\nVeggies', icon: 'apple', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80' },
  { id: '2', name: 'Dairy &\nBread', icon: 'coffee', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80' },
  { id: '3', name: 'Snacks &\nMunchies', icon: 'box', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&q=80' },
  { id: '4', name: 'Beverages', icon: 'droplet', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80' },
  { id: '5', name: 'Personal\nCare', icon: 'heart', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80' },
  { id: '6', name: 'Home\nEssentials', icon: 'home', image: 'https://images.unsplash.com/photo-1584820927498-cafe3c157921?w=200&q=80' },
];

export const INITIAL_PRODUCTS = [
  { id: 'p1', categoryId: '1', name: 'Banana', size: '1 kg', price: 48, oldPrice: 55, discount: '12% OFF', time: '10 min', qty: '1 kg', image: 'https://images.unsplash.com/photo-1571501478200-84b5fc251590?w=300&q=80' },
  { id: 'p2', categoryId: '2', name: 'Amul Taaza Milk', size: '1 L', price: 68, oldPrice: 76, discount: '10% OFF', time: '8 min', qty: '1 L', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80' },
  { id: 'p3', categoryId: '2', name: 'Britannia Brown Bread', size: '400 g', price: 35, oldPrice: 40, discount: '12% OFF', time: '8 min', qty: '400 g', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80' },
  { id: 'p4', categoryId: '3', name: 'Maggi 2-Minute Noodles', size: '280 g', price: 20, oldPrice: 24, discount: '17% OFF', time: '8 min', qty: '280 g', image: 'https://images.unsplash.com/photo-1612928380153-08008b242485?w=300&q=80' },
  { id: 'p5', categoryId: '1', name: 'Farm Fresh Eggs', size: '6 pcs', price: 60, oldPrice: null, discount: null, time: '12 min', qty: '6 pcs', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&q=80' },
  { id: 'p6', categoryId: '2', name: 'Amul Butter', size: '100 g', price: 54, oldPrice: 56, discount: '3% OFF', time: '8 min', qty: '100 g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=80' },
  { id: 'p7', categoryId: '4', name: 'Tata Tea Gold', size: '250 g', price: 145, oldPrice: 160, discount: '9% OFF', time: '15 min', qty: '250 g', image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cbf9?w=300&q=80' },
  { id: 'p8', categoryId: '1', name: 'Onion', size: '1 kg', price: 35, oldPrice: 45, discount: '22% OFF', time: '10 min', qty: '1 kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80' },
  { id: 'p9', categoryId: '1', name: 'Tomato (Local)', size: '1 kg', price: 40, oldPrice: null, discount: null, time: '10 min', qty: '1 kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80' },
  { id: 'p10', categoryId: '3', name: 'Lays India\'s Magic Masala', size: '50 g', price: 20, oldPrice: null, discount: null, time: '8 min', qty: '50 g', image: 'https://images.unsplash.com/photo-1566478989037-e806c9a9d7bb?w=300&q=80' },
  { id: 'p11', categoryId: '4', name: 'Coca Cola', size: '750 ml', price: 40, oldPrice: null, discount: null, time: '12 min', qty: '750 ml', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80' },
  { id: 'p12', categoryId: '5', name: 'Colgate MaxFresh', size: '150 g', price: 99, oldPrice: 110, discount: '10% OFF', time: '15 min', qty: '150 g', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80' },
  { id: 'p13', categoryId: '5', name: 'Dove Soap', size: '100 g', price: 55, oldPrice: 60, discount: '8% OFF', time: '15 min', qty: '100 g', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=300&q=80' },
  { id: 'p14', categoryId: '6', name: 'Surf Excel Matic', size: '1 kg', price: 220, oldPrice: 250, discount: '12% OFF', time: '20 min', qty: '1 kg', image: 'https://images.unsplash.com/photo-1584820927498-cafe3c157921?w=300&q=80' },
  { id: 'p15', categoryId: '6', name: 'Vim Dishwash Gel', size: '500 ml', price: 110, oldPrice: 125, discount: '12% OFF', time: '15 min', qty: '500 ml', image: 'https://images.unsplash.com/photo-1584820927498-cafe3c157921?w=300&q=80' },
  { id: 'p16', categoryId: '1', name: 'Cucumber', size: '500 g', price: 25, oldPrice: 30, discount: '16% OFF', time: '10 min', qty: '500 g', image: 'https://images.unsplash.com/photo-1449339854873-750e6913301b?w=300&q=80' },
  { id: 'p17', categoryId: '3', name: 'Quaker Oats', size: '500 g', price: 95, oldPrice: 110, discount: '13% OFF', time: '10 min', qty: '500 g', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300&q=80' },
  { id: 'p18', categoryId: '4', name: 'Red Bull Energy Drink', size: '250 ml', price: 125, oldPrice: null, discount: null, time: '12 min', qty: '250 ml', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80' },
  { id: 'p19', categoryId: '2', name: 'Mother Dairy Paneer', size: '200 g', price: 85, oldPrice: 90, discount: '5% OFF', time: '10 min', qty: '200 g', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80' },
  { id: 'p20', categoryId: '3', name: 'Haldiram Aloo Bhujia', size: '400 g', price: 105, oldPrice: 115, discount: '8% OFF', time: '10 min', qty: '400 g', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&q=80' },
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-583920',
    date: '2026-09-05T10:30:00Z',
    status: 'Delivered',
    total: 350,
    items: [
      { productId: 'p2', qty: 2, price: 68 },
      { productId: 'p8', qty: 1, price: 35 },
      { productId: 'p14', qty: 1, price: 220 }
    ],
    addressId: 'a1'
  },
  {
    id: 'ORD-583411',
    date: '2026-09-01T18:45:00Z',
    status: 'Cancelled',
    total: 125,
    items: [
      { productId: 'p18', qty: 1, price: 125 }
    ],
    addressId: 'a2'
  }
];

export const INITIAL_STORES = [
  { id: 's1', name: 'Vaishali Nagar Store', deliveryTime: '8-12 min' }
];
