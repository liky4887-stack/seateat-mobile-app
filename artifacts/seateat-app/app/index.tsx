import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { categories, categoryLabels, MenuCategory, menuItems, MenuItem } from '@/data/menu';
import { useCart } from '@/context/CartContext';

type Tab = 'home' | 'menu' | 'cart' | 'orders' | 'profile';
type ViewState = { name: 'tabs' } | { name: 'detail'; item: MenuItem } | { name: 'checkout' };
type IconName = keyof typeof Icon.glyphMap;

const typeface = Platform.select({ web: 'Arial', default: 'System' }) as string;
const money = (value: number) => '$' + value.toFixed(2);

function Glyph({ name, size = 20, color = '#1b1520', fill }: { name: IconName; size?: number; color?: string; fill?: string }) {
  return <Icon name={name} size={size} color={color} {...(fill ? { style: { color: fill } } : {})} />;
}

function BrandMark() {
  const colors = useColors();
  return (
    <View style={styles.brand}>
      <LinearGradient colors={[colors.brandRed, colors.brandPink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.brandIcon}>
        <Glyph name="silverware-fork-knife" size={17} color={colors.card} />
      </LinearGradient>
      <Text style={[styles.brandText, { color: colors.foreground }]}>Seateat</Text>
    </View>
  );
}

function Header({ title, back, onBack, action }: { title?: string; back?: boolean; onBack?: () => void; action?: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      {back ? <Pressable testID="back-button" onPress={onBack} style={styles.headerIcon}><Glyph name="arrow-right" size={23} color={colors.foreground} /></Pressable> : <BrandMark />}
      {title ? <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text> : <View style={styles.headerSpacer} />}
      {action ?? <View style={styles.headerIcon} />}
    </View>
  );
}

function CategoryPill({ category, active, onPress }: { category: MenuCategory; active: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable testID={'category-' + category} onPress={onPress} style={[styles.pill, { backgroundColor: active ? colors.brandRed : colors.card, borderColor: active ? colors.brandRed : colors.border }]}>
      <Text style={[styles.pillText, { color: active ? colors.card : colors.mutedForeground }]}>{categoryLabels[category]}</Text>
    </Pressable>
  );
}

function FoodCard({ item, onSelect }: { item: MenuItem; onSelect: () => void }) {
  const colors = useColors();
  const { addItem } = useCart();
  return (
    <Pressable testID={'food-card-' + item.id} onPress={onSelect} style={({ pressed }) => [styles.foodCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.92 : 1 }]}>
      <View style={[styles.foodImageWrap, { backgroundColor: item.accent }]}>
        <Image source={item.image} style={styles.foodImage as any} contentFit="cover" />
        <Pressable testID={'quick-add-' + item.id} onPress={() => { addItem(item); Haptics.selectionAsync(); }} style={[styles.quickAdd, { backgroundColor: colors.brandGreen }]}>
          <Glyph name="plus" size={18} color={colors.foreground} />
        </Pressable>
      </View>
      <View style={styles.foodCopy}>
        <Text numberOfLines={1} style={[styles.foodName, { color: colors.foreground }]}>{item.name}</Text>
        <Text numberOfLines={2} style={[styles.foodDesc, { color: colors.mutedForeground }]}>{item.description}</Text>
        <Text style={[styles.foodPrice, { color: colors.brandRed }]}>{money(item.price)}</Text>
      </View>
    </Pressable>
  );
}

function Home({ onTab, onSelect }: { onTab: (tab: Tab) => void; onSelect: (item: MenuItem) => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { itemCount, total } = useCart();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<MenuCategory>('Popular');
  const [table, setTable] = useState('12');
  const items = useMemo(() => menuItems.filter((item) => (active === 'Popular' ? item.popular : item.category === active) && item.name.includes(query.trim())), [active, query]);
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.homeTop}>
          <BrandMark />
          <Pressable testID="home-profile-button" onPress={() => onTab('profile')} style={[styles.avatar, { backgroundColor: colors.card }]}>
            <Glyph name="account-circle-outline" size={23} color={colors.brandPurple} />
          </Pressable>
        </View>
        <Text style={[styles.eyebrow, { color: colors.brandRed }]}>مساء الخير</Text>
        <Text style={[styles.heading, { color: colors.foreground }]}>ماذا تشتهي اليوم؟</Text>
        <Text style={[styles.subheading, { color: colors.mutedForeground }]}>اطلب وجبتك اللذيذة من مكانك.</Text>
        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Glyph name="magnify" size={21} color={colors.mutedForeground} />
          <TextInput testID="menu-search" value={query} onChangeText={setQuery} placeholder="ابحث في القائمة" placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} />
        </View>
        <LinearGradient colors={[colors.brandRed, colors.brandPink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tableCard}>
          <View style={styles.tableCopy}>
            <Text style={[styles.tableLabel, { color: colors.card }]}>أنت تطلب من</Text>
            <Text style={[styles.tableTitle, { color: colors.card }]}>طاولة {table}</Text>
            <Text style={[styles.tableHint, { color: colors.card }]}>اضغط لتعديل رقم الطاولة</Text>
          </View>
          <TextInput testID="table-number-input" value={table} onChangeText={setTable} keyboardType="number-pad" maxLength={3} style={[styles.tableInput, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.card }]} />
        </LinearGradient>
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>اكتشف القائمة</Text>
          <Pressable testID="see-all-button" onPress={() => onTab('menu')}><Text style={[styles.seeAll, { color: colors.brandRed }]}>عرض الكل</Text></Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
          {categories.map((category) => <CategoryPill key={category} category={category} active={active === category} onPress={() => setActive(category)} />)}
        </ScrollView>
        <View style={styles.grid}>{items.map((item) => <FoodCard key={item.id} item={item} onSelect={() => onSelect(item)} />)}</View>
        {!items.length && <View style={styles.empty}><Glyph name="magnify-close" size={32} color={colors.mutedForeground} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>لم نجد ما تبحث عنه</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>جرّب طبقاً أو تصنيفاً آخر.</Text></View>}
        <View style={{ height: 100 }} />
      </ScrollView>
      {itemCount > 0 && <Pressable testID="view-cart-button" onPress={() => onTab('cart')} style={[styles.cartBar, { backgroundColor: colors.foreground }]}><View style={[styles.cartBadge, { backgroundColor: colors.brandGreen }]}><Glyph name="shopping-outline" size={19} color={colors.foreground} /><Text style={[styles.badgeCount, { color: colors.foreground, backgroundColor: colors.brandYellow }]}>{itemCount}</Text></View><Text style={[styles.cartLabel, { color: colors.card }]}>عرض طلبك</Text><Text style={[styles.cartTotal, { color: colors.card }]}>{money(total)}</Text></Pressable>}
    </View>
  );
}

function Menu({ onSelect }: { onSelect: (item: MenuItem) => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const [active, setActive] = useState<MenuCategory>('Popular');
  const items = menuItems.filter((item) => active === 'Popular' ? item.popular : item.category === active);
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Header title="القائمة" action={<Glyph name="magnify" size={23} color={colors.foreground} />} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>طازج من المطبخ، وجاهز عندما تكون مستعداً.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>{categories.map((category) => <CategoryPill key={category} category={category} active={active === category} onPress={() => setActive(category)} />)}</ScrollView>
        {items.map((item) => <Pressable key={item.id} testID={'menu-item-' + item.id} onPress={() => onSelect(item)} style={[styles.menuRow, { backgroundColor: colors.card, borderColor: colors.border }]}><Image source={item.image} style={styles.menuImage as any} contentFit="cover" /><View style={styles.menuCopy}><Text style={[styles.menuName, { color: colors.foreground }]}>{item.name}</Text><Text numberOfLines={2} style={[styles.menuDesc, { color: colors.mutedForeground }]}>{item.description}</Text><Text style={[styles.foodPrice, { color: colors.brandRed }]}>{money(item.price)}</Text></View><Pressable testID={'menu-add-' + item.id} onPress={() => addItem(item)} style={[styles.addButton, { backgroundColor: colors.brandGreen }]}><Glyph name="plus" size={18} color={colors.foreground} /></Pressable></Pressable>)}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

function Detail({ item, onBack, onCart }: { item: MenuItem; onBack: () => void; onCart: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Header back onBack={onBack} action={<Pressable testID="favorite-button" onPress={() => setFavorite((value) => !value)}><Glyph name={favorite ? 'heart' : 'heart-outline'} size={25} color={favorite ? colors.brandRed : colors.foreground} /></Pressable>} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.detailHero, { backgroundColor: item.accent }]}><Image source={item.image} style={styles.detailImage as any} contentFit="cover" /><View style={[styles.detailBadge, { backgroundColor: colors.card }]}><Glyph name="star-four-points" size={15} color={colors.brandRed} /></View></View>
        <Text style={[styles.eyebrow, { color: colors.brandRed }]}>{categoryLabels[item.category]}</Text>
        <Text style={[styles.detailTitle, { color: colors.foreground }]}>{item.name}</Text>
        <Text style={[styles.detailPrice, { color: colors.brandRed }]}>{money(item.price)}</Text>
        <Text style={[styles.detailDesc, { color: colors.mutedForeground }]}>{item.description}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.quantityRow}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>الكمية</Text><View style={[styles.stepper, { backgroundColor: colors.card, borderColor: colors.border }]}><Pressable testID="decrease-quantity" onPress={() => setQuantity((value) => Math.max(1, value - 1))} style={styles.stepperButton}><Glyph name="minus" size={16} color={colors.foreground} /></Pressable><Text style={[styles.quantity, { color: colors.foreground }]}>{quantity}</Text><Pressable testID="increase-quantity" onPress={() => setQuantity((value) => value + 1)} style={styles.stepperButton}><Glyph name="plus" size={16} color={colors.foreground} /></Pressable></View></View>
        <Pressable testID="add-to-cart-button" onPress={() => { addItem(item, quantity); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onCart(); }}><LinearGradient colors={[colors.brandRed, colors.brandPink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryButton}><Glyph name="shopping-outline" size={20} color={colors.card} /><Text style={[styles.primaryButtonText, { color: colors.card }]}>أضف للطلب · {money(item.price * quantity)}</Text></LinearGradient></Pressable>
      </ScrollView>
    </View>
  );
}

function Cart({ onCheckout, onMenu }: { onCheckout: () => void; onMenu: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lines, setQuantity, clearCart, subtotal, serviceFee, total } = useCart();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Header title="طلبك" action={<Pressable testID="clear-cart-button" onPress={clearCart}><Glyph name="trash-can-outline" size={22} color={colors.mutedForeground} /></Pressable>} />
      <ScrollView contentContainerStyle={styles.content}>
        {lines.length ? <>{lines.map((line) => <View key={line.id} style={[styles.menuRow, { backgroundColor: colors.card, borderColor: colors.border }]}><Image source={line.image} style={styles.cartImage as any} contentFit="cover" /><View style={styles.menuCopy}><Text style={[styles.menuName, { color: colors.foreground }]}>{line.name}</Text><Text style={[styles.foodPrice, { color: colors.brandRed }]}>{money(line.price)}</Text><View style={[styles.stepper, styles.smallStepper, { backgroundColor: colors.muted }]}><Pressable onPress={() => setQuantity(line.id, line.quantity - 1)} style={styles.stepperButton}><Glyph name="minus" size={14} color={colors.foreground} /></Pressable><Text style={[styles.quantity, { color: colors.foreground }]}>{line.quantity}</Text><Pressable onPress={() => setQuantity(line.id, line.quantity + 1)} style={styles.stepperButton}><Glyph name="plus" size={14} color={colors.foreground} /></Pressable></View></View><Text style={[styles.lineTotal, { color: colors.foreground }]}>{money(line.price * line.quantity)}</Text></View>)}<View style={[styles.summary, { borderColor: colors.border }]}><View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>المجموع الفرعي</Text><Text style={[styles.summaryValue, { color: colors.foreground }]}>{money(subtotal)}</Text></View><View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>رسوم الخدمة</Text><Text style={[styles.summaryValue, { color: colors.foreground }]}>{money(serviceFee)}</Text></View><View style={styles.summaryRow}><Text style={[styles.totalLabel, { color: colors.foreground }]}>الإجمالي</Text><Text style={[styles.totalValue, { color: colors.brandRed }]}>{money(total)}</Text></View></View><Pressable testID="checkout-button" onPress={onCheckout}><LinearGradient colors={[colors.brandRed, colors.brandPink]} style={styles.primaryButton}><Text style={[styles.primaryButtonText, { color: colors.card }]}>متابعة إلى الدفع</Text><Glyph name="arrow-left" size={19} color={colors.card} /></LinearGradient></Pressable></> : <View style={styles.emptyLarge}><View style={[styles.emptyIcon, { backgroundColor: colors.brandGreen }]}><Glyph name="shopping-outline" size={32} color={colors.foreground} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>طلبك فارغ</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>أضف شيئاً لذيذاً من القائمة.</Text><Pressable testID="browse-menu-button" onPress={onMenu}><LinearGradient colors={[colors.brandRed, colors.brandPink]} style={styles.browseButton}><Text style={[styles.primaryButtonText, { color: colors.card }]}>تصفح القائمة</Text></LinearGradient></Pressable></View>}
      </ScrollView>
    </View>
  );
}

function Checkout({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { total, clearCart } = useCart();
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const placeOrder = () => { if (!name.trim()) { Alert.alert('أدخل اسمك', 'أخبرنا باسم الشخص الذي سيستلم الطلب.'); return; } clearCart(); onDone(); };
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Header title="إتمام الطلب" back onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.notice, { backgroundColor: colors.brandGreen }]}><Glyph name="check-circle-outline" size={23} color={colors.foreground} /><View style={styles.noticeCopy}><Text style={[styles.noticeTitle, { color: colors.foreground }]}>الطلب من الطاولة 12</Text><Text style={[styles.noticeText, { color: colors.foreground }]}>سيحضر لك النادل كل شيء إلى مكانك.</Text></View></View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>بياناتك</Text>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>الاسم</Text>
        <TextInput testID="name-input" value={name} onChangeText={setName} placeholder="مثال: مايا" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
        <Text style={[styles.label, { color: colors.mutedForeground }]}>ملاحظة على الطلب (اختياري)</Text>
        <TextInput testID="order-note-input" value={note} onChangeText={setNote} placeholder="هل لديك حساسية أو طلب خاص؟" placeholderTextColor={colors.mutedForeground} multiline style={[styles.input, styles.noteInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 9 }]}>طريقة الدفع</Text>
        <View style={[styles.paymentRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.paymentIcon, { backgroundColor: colors.brandPurple }]}><Glyph name="credit-card-outline" size={20} color={colors.card} /></View><View style={styles.menuCopy}><Text style={[styles.menuName, { color: colors.foreground }]}>الدفع على الطاولة</Text><Text style={[styles.menuDesc, { color: colors.mutedForeground }]}>نقداً أو بالبطاقة مع النادل</Text></View><Glyph name="chevron-left" size={21} color={colors.mutedForeground} /></View>
        <Pressable testID="place-order-button" onPress={placeOrder}><LinearGradient colors={[colors.brandRed, colors.brandPink]} style={styles.primaryButton}><Text style={[styles.primaryButtonText, { color: colors.card }]}>تأكيد الطلب · {money(total)}</Text></LinearGradient></Pressable>
      </ScrollView>
    </View>
  );
}

function Orders() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Header title="طلباتي" />
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={[colors.brandPurple, colors.brandBlue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.activeOrder}><View style={styles.orderTop}><View style={[styles.statusDot, { backgroundColor: colors.brandYellow }]} /><Text style={[styles.status, { color: colors.card }]}>قيد التحضير</Text><Text style={[styles.orderNumber, { color: colors.card }]}>#1042</Text></View><Text style={[styles.activeTitle, { color: colors.card }]}>طلبك قيد التجهيز</Text><Text style={[styles.activeText, { color: colors.card }]}>سنحضره لك مباشرة إلى الطاولة 12.</Text><View style={styles.progress}><View style={[styles.progressFill, { backgroundColor: colors.brandYellow }]} /></View><View style={styles.progressLabels}><Text style={[styles.progressLabel, { color: colors.card }]}>تم التأكيد</Text><Text style={[styles.progressLabel, { color: colors.card }]}>يُطهى الآن</Text><Text style={[styles.progressLabel, { color: colors.card }]}>تم التقديم</Text></View></LinearGradient>
        <Text style={[styles.historyTitle, { color: colors.foreground }]}>الطلبات السابقة</Text>
        {[['جيوزا الدجاج · قطعتان', 'اليوم، ٧:٤٢ م · الطاولة 12', '$29.40'], ['رامن الفطر بالميسو', 'أمس، ٨:١٥ م · الطاولة 08', '$16.00']].map(([name, meta, price], index) => <View key={name} style={[styles.historyRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.historyIcon, { backgroundColor: index === 0 ? colors.brandGreen : colors.warm }]}><Glyph name={index === 0 ? 'check' : 'reload'} size={20} color={colors.foreground} /></View><View style={styles.menuCopy}><Text style={[styles.menuName, { color: colors.foreground }]}>{name}</Text><Text style={[styles.menuDesc, { color: colors.mutedForeground }]}>{meta}</Text></View><Text style={[styles.lineTotal, { color: colors.foreground }]}>{price}</Text></View>)}
      </ScrollView>
    </View>
  );
}

function Profile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const options: { icon: IconName; label: string }[] = [{ icon: 'account-outline', label: 'البيانات الشخصية' }, { icon: 'bell-outline', label: 'الإشعارات' }, { icon: 'help-circle-outline', label: 'المساعدة والدعم' }, { icon: 'cog-outline', label: 'الإعدادات' }];
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Header title="حسابي" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profile}><LinearGradient colors={[colors.brandPurple, colors.brandPink]} style={styles.profileAvatar}><Glyph name="account" size={36} color={colors.card} /></LinearGradient><Text style={[styles.profileName, { color: colors.foreground }]}>مايا</Text><Text style={[styles.subheading, { color: colors.mutedForeground }]}>مرحباً بعودتك إلى Seateat</Text></View>
        <View style={[styles.memberCard, { backgroundColor: colors.cream }]}><View style={[styles.memberIcon, { backgroundColor: colors.brandRed }]}><Glyph name="star-four-points" size={20} color={colors.card} /></View><View style={styles.menuCopy}><Text style={[styles.menuName, { color: colors.brandRedDark }]}>عضو مميز</Text><Text style={[styles.menuDesc, { color: colors.brandRedDark }]}>استمتعت بـ 12 وجبة معنا.</Text></View><Glyph name="chevron-left" size={21} color={colors.brandRedDark} /></View>
        <View style={[styles.options, { backgroundColor: colors.card, borderColor: colors.border }]}>{options.map((option) => <Pressable key={option.label} style={styles.option}><View style={[styles.optionIcon, { backgroundColor: colors.muted }]}><Glyph name={option.icon} size={20} color={colors.brandPurple} /></View><Text style={[styles.optionLabel, { color: colors.foreground }]}>{option.label}</Text><Glyph name="chevron-left" size={19} color={colors.mutedForeground} /></Pressable>)}</View>
        <Pressable testID="sign-out-button" style={styles.signOut}><Glyph name="logout-variant" size={19} color={colors.brandRed} /><Text style={[styles.signOutText, { color: colors.brandRed }]}>تسجيل الخروج</Text></Pressable>
      </ScrollView>
    </View>
  );
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const tabs: { key: Tab; icon: IconName; label: string }[] = [{ key: 'home', icon: 'home-variant-outline', label: 'الرئيسية' }, { key: 'menu', icon: 'view-grid-outline', label: 'القائمة' }, { key: 'cart', icon: 'shopping-outline', label: 'الطلب' }, { key: 'orders', icon: 'clock-outline', label: 'طلباتي' }, { key: 'profile', icon: 'account-circle-outline', label: 'حسابي' }];
  return <View style={[styles.nav, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 9) }]}>{tabs.map((tab) => <Pressable testID={'tab-' + tab.key} key={tab.key} onPress={() => onChange(tab.key)} style={styles.navItem}><View style={[styles.navIcon, { backgroundColor: active === tab.key ? colors.brandGreen : 'transparent' }]}><Glyph name={tab.icon} size={22} color={active === tab.key ? colors.foreground : colors.mutedForeground} /></View><Text style={[styles.navLabel, { color: active === tab.key ? colors.foreground : colors.mutedForeground }]}>{tab.label}</Text></Pressable>)}</View>;
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [view, setView] = useState<ViewState>({ name: 'tabs' });
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const selectItem = (item: MenuItem) => { setSelected(item); setView({ name: 'detail', item }); };
  if (view.name === 'detail' && selected) return <Detail item={selected} onBack={() => setView({ name: 'tabs' })} onCart={() => { setTab('cart'); setView({ name: 'tabs' }); }} />;
  if (view.name === 'checkout') return <Checkout onBack={() => setView({ name: 'tabs' })} onDone={() => { setTab('orders'); setView({ name: 'tabs' }); }} />;
  const screen = tab === 'home' ? <Home onTab={setTab} onSelect={selectItem} /> : tab === 'menu' ? <Menu onSelect={selectItem} /> : tab === 'cart' ? <Cart onCheckout={() => setView({ name: 'checkout' })} onMenu={() => setTab('menu')} /> : tab === 'orders' ? <Orders /> : <Profile />;
  return <View style={styles.app}><View style={styles.tabContent}>{screen}</View><BottomNav active={tab} onChange={setTab} /></View>;
}

const styles = StyleSheet.create({
  app: { flex: 1 },
  tabContent: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 35 },
  brand: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 9 },
  brandIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center' as const, justifyContent: 'center' as const },
  brandText: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 21, letterSpacing: -0.7 },
  header: { minHeight: 66, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingHorizontal: 18 },
  headerTitle: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 23, letterSpacing: -0.5 },
  headerSpacer: { flex: 1 },
  headerIcon: { width: 42, height: 42, alignItems: 'center' as const, justifyContent: 'center' as const },
  homeTop: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginTop: 16, marginBottom: 25 },
  avatar: { width: 44, height: 44, borderRadius: 16, alignItems: 'center' as const, justifyContent: 'center' as const, borderWidth: 1, borderColor: '#f2c1d0' },
  eyebrow: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 12, letterSpacing: 1.2, marginBottom: 7, textAlign: 'right' as const },
  heading: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 31, letterSpacing: -1, marginBottom: 6, textAlign: 'right' as const },
  subheading: { fontFamily: typeface, fontSize: 14, marginBottom: 19, textAlign: 'right' as const },
  search: { height: 54, borderRadius: 21, borderWidth: 1, flexDirection: 'row' as const, alignItems: 'center' as const, paddingHorizontal: 16, gap: 10, marginBottom: 18 },
  searchInput: { flex: 1, fontFamily: typeface, fontSize: 14, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  tableCard: { minHeight: 126, borderRadius: 27, padding: 18, flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 30, overflow: 'hidden' as const },
  tableCopy: { flex: 1 },
  tableLabel: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 11, marginBottom: 4, textAlign: 'right' as const },
  tableTitle: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 26, letterSpacing: -0.5, marginBottom: 3, textAlign: 'right' as const },
  tableHint: { fontFamily: typeface, fontSize: 11, textAlign: 'right' as const },
  tableInput: { width: 53, height: 53, borderRadius: 27, borderWidth: 3, textAlign: 'center' as const, fontFamily: typeface, fontWeight: '800' as const, fontSize: 16 },
  sectionHead: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 13 },
  sectionTitle: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 20, letterSpacing: -0.4, textAlign: 'right' as const },
  seeAll: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 13 },
  pills: { gap: 9, paddingBottom: 18 },
  pill: { borderRadius: 22, borderWidth: 1, paddingHorizontal: 17, paddingVertical: 11 },
  pillText: { fontFamily: typeface, fontWeight: '700' as const, fontSize: 12 },
  grid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, justifyContent: 'space-between' as const, gap: 13 },
  foodCard: { width: '47.8%' as any, borderWidth: 1, borderRadius: 25, overflow: 'hidden' as const, marginBottom: 1, shadowColor: '#c65b85', shadowOpacity: 0.09, shadowRadius: 11, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  foodImageWrap: { height: 137, position: 'relative' as const },
  foodImage: { width: '100%' as any, height: '100%' as any },
  quickAdd: { position: 'absolute' as const, left: 10, bottom: 10, width: 34, height: 34, borderRadius: 17, alignItems: 'center' as const, justifyContent: 'center' as const },
  foodCopy: { padding: 12 },
  foodName: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 13, marginBottom: 4, textAlign: 'right' as const },
  foodDesc: { fontFamily: typeface, fontSize: 10.5, lineHeight: 16, minHeight: 32, marginBottom: 7, textAlign: 'right' as const },
  foodPrice: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 15, textAlign: 'right' as const },
  cartBar: { position: 'absolute' as const, left: 16, right: 16, bottom: 15, height: 62, borderRadius: 23, flexDirection: 'row' as const, alignItems: 'center' as const, paddingHorizontal: 13, gap: 12, elevation: 7 },
  cartBadge: { width: 39, height: 39, borderRadius: 15, alignItems: 'center' as const, justifyContent: 'center' as const, position: 'relative' as const },
  badgeCount: { position: 'absolute' as const, right: -3, top: -3, minWidth: 16, height: 16, borderRadius: 8, fontSize: 9, fontFamily: typeface, fontWeight: '800' as const, textAlign: 'center' as const, paddingTop: 2 },
  cartLabel: { flex: 1, fontFamily: typeface, fontWeight: '800' as const, fontSize: 14, textAlign: 'right' as const },
  cartTotal: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 15 },
  intro: { fontFamily: typeface, fontSize: 14, marginBottom: 17, textAlign: 'right' as const },
  menuRow: { borderWidth: 1, borderRadius: 23, padding: 10, flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 12, shadowColor: '#c65b85', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  menuImage: { width: 92, height: 92, borderRadius: 18 },
  cartImage: { width: 76, height: 76, borderRadius: 17 },
  menuCopy: { flex: 1, paddingHorizontal: 12 },
  menuName: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 13, marginBottom: 5, textAlign: 'right' as const },
  menuDesc: { fontFamily: typeface, fontSize: 11, lineHeight: 16, marginBottom: 7, textAlign: 'right' as const },
  addButton: { width: 38, height: 38, borderRadius: 15, alignItems: 'center' as const, justifyContent: 'center' as const },
  detailHero: { height: 274, borderRadius: 29, overflow: 'hidden' as const, marginBottom: 24, position: 'relative' as const },
  detailImage: { width: '100%' as any, height: '100%' as any },
  detailBadge: { position: 'absolute' as const, left: 14, top: 14, width: 38, height: 38, borderRadius: 14, alignItems: 'center' as const, justifyContent: 'center' as const },
  detailTitle: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 30, letterSpacing: -0.8, marginBottom: 7, textAlign: 'right' as const },
  detailPrice: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 19, marginBottom: 12, textAlign: 'right' as const },
  detailDesc: { fontFamily: typeface, fontSize: 15, lineHeight: 24, textAlign: 'right' as const },
  divider: { height: 1, marginVertical: 23 },
  quantityRow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
  stepper: { height: 46, borderRadius: 24, borderWidth: 1, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 17, paddingHorizontal: 6 },
  smallStepper: { height: 38, borderWidth: 0, gap: 10, alignSelf: 'flex-start' as const },
  stepperButton: { width: 33, height: 33, borderRadius: 17, alignItems: 'center' as const, justifyContent: 'center' as const },
  quantity: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 15 },
  primaryButton: { height: 60, borderRadius: 22, alignItems: 'center' as const, justifyContent: 'center' as const, flexDirection: 'row' as const, gap: 10, marginTop: 28, paddingHorizontal: 18 },
  primaryButtonText: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 14 },
  summary: { borderTopWidth: 1, paddingTop: 17, marginTop: 12, gap: 13 },
  summaryRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  summaryLabel: { fontFamily: typeface, fontSize: 13, textAlign: 'right' as const },
  summaryValue: { fontFamily: typeface, fontWeight: '700' as const, fontSize: 13 },
  totalLabel: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 18 },
  totalValue: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 21 },
  label: { fontFamily: typeface, fontWeight: '700' as const, fontSize: 12, marginBottom: 8, textAlign: 'right' as const },
  input: { minHeight: 54, borderRadius: 18, borderWidth: 1, paddingHorizontal: 15, fontFamily: typeface, fontSize: 14, marginBottom: 17, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  noteInput: { minHeight: 98, paddingTop: 15, textAlignVertical: 'top' as const },
  notice: { borderRadius: 22, padding: 15, flexDirection: 'row' as const, gap: 12, alignItems: 'center' as const, marginBottom: 28 },
  noticeCopy: { flex: 1 },
  noticeTitle: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 13, marginBottom: 4, textAlign: 'right' as const },
  noticeText: { fontFamily: typeface, fontSize: 11, textAlign: 'right' as const },
  paymentRow: { borderWidth: 1, borderRadius: 22, padding: 13, flexDirection: 'row' as const, alignItems: 'center' as const },
  paymentIcon: { width: 43, height: 43, borderRadius: 15, alignItems: 'center' as const, justifyContent: 'center' as const },
  activeOrder: { borderRadius: 28, padding: 20, marginBottom: 29 },
  orderTop: { flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 14 },
  statusDot: { width: 9, height: 9, borderRadius: 5, marginRight: 7 },
  status: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 11 },
  orderNumber: { fontFamily: typeface, fontWeight: '700' as const, fontSize: 11, marginLeft: 'auto' as const },
  activeTitle: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 21, letterSpacing: -0.5, marginBottom: 7, textAlign: 'right' as const },
  activeText: { fontFamily: typeface, fontSize: 12, marginBottom: 20, textAlign: 'right' as const },
  progress: { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' as const },
  progressFill: { height: '100%' as any, width: '58%' as any, borderRadius: 4 },
  progressLabels: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, marginTop: 9 },
  progressLabel: { fontFamily: typeface, fontWeight: '700' as const, fontSize: 10 },
  historyTitle: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 20, marginBottom: 13, textAlign: 'right' as const },
  historyRow: { borderWidth: 1, borderRadius: 22, padding: 12, flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 10 },
  historyIcon: { width: 42, height: 42, borderRadius: 15, alignItems: 'center' as const, justifyContent: 'center' as const },
  lineTotal: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 14 },
  profile: { alignItems: 'center' as const, paddingVertical: 16, marginBottom: 21 },
  profileAvatar: { width: 84, height: 84, borderRadius: 30, alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 13 },
  profileName: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 23, letterSpacing: -0.5, marginBottom: 5 },
  memberCard: { borderRadius: 23, padding: 15, flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 21 },
  memberIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center' as const, justifyContent: 'center' as const },
  options: { borderRadius: 23, borderWidth: 1, overflow: 'hidden' as const },
  option: { minHeight: 69, flexDirection: 'row' as const, alignItems: 'center' as const, paddingHorizontal: 13, borderBottomWidth: 1, borderBottomColor: '#f4d4df' },
  optionIcon: { width: 39, height: 39, borderRadius: 14, alignItems: 'center' as const, justifyContent: 'center' as const },
  optionLabel: { flex: 1, paddingHorizontal: 12, fontFamily: typeface, fontWeight: '700' as const, fontSize: 13, textAlign: 'right' as const },
  signOut: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8, marginTop: 26, paddingVertical: 10 },
  signOutText: { fontFamily: typeface, fontWeight: '700' as const, fontSize: 13 },
  nav: { minHeight: 76, borderTopWidth: 1, flexDirection: 'row' as const, justifyContent: 'space-around' as const, alignItems: 'center' as const },
  navItem: { alignItems: 'center' as const, justifyContent: 'center' as const, gap: 4, minWidth: 54 },
  navIcon: { width: 36, height: 30, borderRadius: 13, alignItems: 'center' as const, justifyContent: 'center' as const },
  navLabel: { fontFamily: typeface, fontWeight: '700' as const, fontSize: 9 },
  empty: { alignItems: 'center' as const, paddingVertical: 45, gap: 8 },
  emptyLarge: { alignItems: 'center' as const, paddingTop: 110, gap: 9 },
  emptyIcon: { width: 76, height: 76, borderRadius: 28, alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 6 },
  emptyTitle: { fontFamily: typeface, fontWeight: '800' as const, fontSize: 19 },
  emptyText: { fontFamily: typeface, fontSize: 13, marginBottom: 10 },
  browseButton: { paddingHorizontal: 25, paddingVertical: 14, borderRadius: 19, marginTop: 4 },
});