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

export const categoryLabels: Record<MenuCategory, string> = {
  Popular: 'الأكثر طلباً',
  Starters: 'المقبلات',
  Mains: 'الأطباق الرئيسية',
  Bowls: 'الأوعية',
  Drinks: 'المشروبات',
  Desserts: 'الحلويات',
};

export const menuItems: MenuItem[] = [
  { id: 'gyoza', name: 'جيوزا الدجاج المقرمشة', description: 'فطائر محمّرة مع البصل الأخضر والسمسم وزيت الفلفل.', price: 12.5, category: 'Popular', image: require('../assets/food/food-4.png'), accent: '#ffd5a8', popular: true },
  { id: 'ramen', name: 'رامن الفطر بالميسو', description: 'مرق ميسو ناعم مع الفطر والذرة والخضار والنودلز.', price: 16, category: 'Mains', image: require('../assets/food/food-2.jpg'), accent: '#c9f0df', popular: true },
  { id: 'dumplings', name: 'دامبلنغ لحم حار', description: 'دامبلنغ مطهو على البخار مع الزنجبيل والثوم والفلفل.', price: 11, category: 'Starters', image: require('../assets/food/food-2.jpg'), accent: '#ffc4d6' },
  { id: 'rice-bowl', name: 'وعاء السلمون المشوي', description: 'أرز ياسمين وأفوكادو وخيار وأعشاب وصلصة السمسم.', price: 18.5, category: 'Bowls', image: require('../assets/food/food-4.png'), accent: '#d7e7ff' },
  { id: 'bao', name: 'باو لحم بالكراميل', description: 'باو طري مع لحم بالكراميل وخيار مخلل وأعشاب.', price: 13, category: 'Mains', image: require('../assets/food/food-4.png'), accent: '#ead7ff' },
  { id: 'matcha', name: 'لاتيه ماتشا بارد', description: 'ماتشا احتفالي مع حليب الشوفان والفانيلا والثلج.', price: 6.5, category: 'Drinks', image: require('../assets/food/food-2.jpg'), accent: '#c7f5e8' },
  { id: 'mochi', name: 'موتشي المانجو', description: 'ثلاث قطع أرز طرية محشوة بكريمة المانجو الطازجة.', price: 8, category: 'Desserts', image: require('../assets/food/food-4.png'), accent: '#ffe1a8' },
];