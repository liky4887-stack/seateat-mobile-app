export type MenuCategory = 'Popular' | 'Starters' | 'Mains' | 'Bowls' | 'Drinks' | 'Desserts';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: number;
  accent: string;
  popular?: boolean;
};

export const categories: MenuCategory[] = ['Popular', 'Starters', 'Mains', 'Bowls', 'Drinks', 'Desserts'];

export const menuItems: MenuItem[] = [
  { id: 'gyoza', name: 'Crispy Chicken Gyoza', description: 'Pan-fried dumplings, spring onion, sesame and chili oil.', price: 12.5, category: 'Popular', image: require('../assets/food/food-4.png'), accent: '#e8cba3', popular: true },
  { id: 'ramen', name: 'Miso Mushroom Ramen', description: 'Silky miso broth, shiitake, corn, greens and noodles.', price: 16, category: 'Mains', image: require('../assets/food/food-2.jpg'), accent: '#d9ead9', popular: true },
  { id: 'dumplings', name: 'Spicy Pork Dumplings', description: 'Steamed dumplings with ginger, garlic and chili crisp.', price: 11, category: 'Starters', image: require('../assets/food/food-2.jpg'), accent: '#f2d8cf' },
  { id: 'rice-bowl', name: 'Seared Salmon Bowl', description: 'Jasmine rice, avocado, cucumber, herbs and sesame dressing.', price: 18.5, category: 'Bowls', image: require('../assets/food/food-4.png'), accent: '#dce6c9' },
  { id: 'bao', name: 'Sticky Pork Bao', description: 'Soft bao, caramelized pork, pickled cucumber and herbs.', price: 13, category: 'Mains', image: require('../assets/food/food-4.png'), accent: '#f0d8bd' },
  { id: 'matcha', name: 'Iced Matcha Latte', description: 'Ceremonial matcha, oat milk and vanilla over ice.', price: 6.5, category: 'Drinks', image: require('../assets/food/food-2.jpg'), accent: '#d9e7cf' },
  { id: 'mochi', name: 'Mango Mochi', description: 'Three soft rice cakes filled with fresh mango cream.', price: 8, category: 'Desserts', image: require('../assets/food/food-4.png'), accent: '#f3dfb6' },
];