import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { assets } from '../../assets';
import BottomNavigation from '../../components/BottomNavigation';

const FONT = {
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semibold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
  extrabold: 'Outfit-ExtraBold',
};

const COLORS = {
  background: '#F8FAF7',
  surface: '#FFFFFF',
  primaryGreen: '#16A34A',
  primaryGreenSoft: '#22C55E',
  deepGreen: '#087443',
  softGreen: '#EAF7EE',
  limeAccent: '#A3E635',
  primaryText: '#111814',
  secondaryText: '#6B756E',
  tertiaryText: '#98A39D',
  border: '#E5EAE6',
  successGreen: '#22C55E',
  shadow: 'rgba(17, 24, 20, 0.06)',
};

const ImagePlaceholder = ({ width, height, borderRadius = 0, style, source }) => {
  if (source) {
    return <Image source={{ uri: source }} style={[{ width, height, borderRadius }, style]} />;
  }
  return <View style={[{ width, height, borderRadius, backgroundColor: '#E5EAE6' }, style]} />;
};

const CATEGORIES = [
  { id: '1', name: 'Fruits &\nVeggies', placeholder: assets.categories.fruits },
  { id: '2', name: 'Dairy &\nBread', placeholder: assets.categories.dairy },
  { id: '3', name: 'Snacks &\nMunchies', placeholder: assets.categories.snacks },
  { id: '4', name: 'Beverages', placeholder: assets.categories.beverages },
  { id: '5', name: 'Personal\nCare', placeholder: assets.categories.personalCare },
  { id: '6', name: 'Home\nEssentials', placeholder: assets.categories.homeEssentials },
];

const POPULAR_PRODUCTS = [
  { id: '1', name: 'Banana', qty: '1 kg', price: '₹48', time: '10 min', placeholder: assets.products.banana },
  { id: '2', name: 'Amul Taaza Milk', qty: '1 L', price: '₹68', time: '8 min', placeholder: assets.products.milk },
  { id: '3', name: 'Britannia Brown Bread', qty: '400 g', price: '₹35', time: '10 min', placeholder: assets.products.bread },
  { id: '4', name: 'Maggi 2-Minute Noodles', qty: '280 g', price: '₹20', time: '8 min', placeholder: assets.products.maggi },
];

const HomeScreen = ({ onNavigate }) => {
  const { state, addToCart, updateCartQty } = useStore();
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
  };
  
  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const userName = state.user.name;
  
  const displayCategories = state.categories;
  const displayProducts = state.products.slice(0, 5);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* LOCATION + PROFILE HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.locationContainer} activeOpacity={0.7}>
              <View style={styles.locationIconWrapper}>
                <Ionicons name="location" size={16} color={COLORS.primaryGreen} />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.deliveringTo}>Delivering to</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationTitle}>Home · Jaipur</Text>
                  <Feather name="chevron-down" size={14} color={COLORS.secondaryText} style={{ marginLeft: 4 }} />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
                <Feather name="bell" size={20} color={COLORS.primaryText} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <ImagePlaceholder width={42} height={42} borderRadius={21} style={styles.avatarPlaceholder} />
              </TouchableOpacity>
            </View>
          </View>

          {/* GREETING */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Good morning, <Text style={{ color: COLORS.primaryGreen }}>{userName}</Text> 👋
            </Text>
          </View>

          {/* HERO HEADLINE */}
          <View style={styles.heroContainer}>
            <Text style={styles.heroHeadline}>
              Fresh essentials,{'\n'}
              delivered in <Text style={{ color: COLORS.primaryGreen }}>minutes.</Text>
            </Text>
            {/* Reserved slot for the leaf/branch illustration in the top-right corner */}
            <ImagePlaceholder width={90} height={110} style={styles.heroLeafPlaceholder} />
          </View>

          {/* SEARCH BAR */}
          <TouchableOpacity style={styles.searchContainer} activeOpacity={0.9} onPress={() => onNavigate('Search')}>
            <View style={styles.searchLeft}>
              <Svg width="20" height="20" viewBox="0 0 256 256" fill={COLORS.secondaryText} style={{ marginRight: 10 }}>
                <Path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </Svg>
              <Text style={styles.searchPlaceholderText}>Search milk, bread, eggs...</Text>
            </View>
          </TouchableOpacity>

          {/* DELIVERY PROMISE CARD */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryCardLeft}>
              <Text style={styles.deliveryInText}>Delivery in</Text>
              <View style={styles.deliveryTimeRow}>
                <Feather name="zap" size={22} color={COLORS.primaryGreen} style={{ marginRight: 4 }} />
                <Text style={styles.deliveryTimeText}>
                  8–12 <Text style={styles.deliveryTimeMin}>min</Text>
                </Text>
              </View>
              <TouchableOpacity style={styles.storeRow} activeOpacity={0.7}>
                <Text style={styles.storeText}>
                  From <Text style={styles.storeHighlight}>{state.stores[0]?.name || 'Local Store'}</Text>
                </Text>
                <Feather name="chevron-right" size={13} color={COLORS.primaryGreen} style={{ marginLeft: 2 }} />
              </TouchableOpacity>
              <View style={styles.onTimePill}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.successGreen} />
                <Text style={styles.onTimeText}> On time, every time.</Text>
              </View>
            </View>
            <View style={styles.deliveryCardRight}>
              {/* Reserved slot for the delivery-bag illustration */}
              <ImagePlaceholder width={120} height={130} borderRadius={12} />
            </View>
          </View>

          {/* CATEGORY ROW */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {displayCategories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.75}>
                <View style={styles.categoryImageContainer}>
                  <ImagePlaceholder width={72} height={72} borderRadius={20} style={{ backgroundColor: 'transparent' }} source={cat.image} />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* PROMOTIONAL BANNER */}
          <TouchableOpacity style={styles.promoBanner} activeOpacity={0.9}>
            <View style={styles.promoLeft}>
              <Text style={styles.promoHeadline}>
                Flat <Text style={styles.promoHighlight}>20% off</Text>
              </Text>
              <Text style={styles.promoSub}>On your first order</Text>
              <View style={styles.promoCodePill}>
                <Text style={styles.promoCodeText}>ORDER20</Text>
              </View>
            </View>
            <View style={styles.promoRight}>
              {/* Reserved slot for the promo basket illustration */}
              <ImagePlaceholder width={110} height={90} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
              <View style={styles.promoArrowBtn}>
                <Feather name="chevron-right" size={18} color={COLORS.deepGreen} />
              </View>
            </View>
          </TouchableOpacity>

          {/* POPULAR NEAR YOU HEADER */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular near you</Text>
            <TouchableOpacity style={styles.seeAllRow} activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See all</Text>
              <Feather name="chevron-right" size={15} color={COLORS.primaryGreen} />
            </TouchableOpacity>
          </View>

          {/* PRODUCT CARDS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
            {displayProducts.map((product) => {
              const cartItem = state.cart.find(i => i.productId === product.id);
              const qty = cartItem ? cartItem.qty : 0;
              return (
              <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.9} onPress={() => onNavigate({ name: 'Product', params: { id: product.id } })}>
                <View style={styles.productImageWrapper}>
                  {/* Reserved slot for product photography */}
                  <ImagePlaceholder width={110} height={110} borderRadius={12} source={product.image} />
                  <View style={styles.timeBadge}>
                    <Feather name="zap" size={10} color={COLORS.primaryGreen} />
                    <Text style={styles.timeBadgeText}> {product.time}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.favoriteBtn}
                    onPress={() => toggleFavorite(product.id)}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <Ionicons
                      name={favorites[product.id] ? 'heart' : 'heart-outline'}
                      size={16}
                      color={favorites[product.id] ? COLORS.primaryGreen : COLORS.secondaryText}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <Text style={styles.productQty}>{product.size}</Text>
                  <View style={styles.productBottomRow}>
                    <Text style={styles.productPrice}>₹{product.price}</Text>
                    {qty > 0 ? (
                      <View style={styles.qtyControlSmall}>
                        <TouchableOpacity style={styles.qtyBtnSmall} onPress={() => updateCartQty(product.id, qty - 1)}>
                          <Text style={styles.qtyBtnTextSmall}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyTextSmall}>{qty}</Text>
                        <TouchableOpacity style={styles.qtyBtnSmall} onPress={() => handleAddToCart(product)}>
                          <Text style={styles.qtyBtnTextSmall}>+</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(product)} activeOpacity={0.8}>
                        <Feather name="plus" size={16} color={COLORS.primaryGreen} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )})}
          </ScrollView>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      <BottomNavigation activeTab="Home" onNavigate={onNavigate} cartCount={cartCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 130 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationTextContainer: { justifyContent: 'center' },
  deliveringTo: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.secondaryText, marginBottom: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationTitle: { fontFamily: FONT.bold, fontSize: 15, color: COLORS.primaryText },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  notificationBtn: { marginRight: 16, position: 'relative' },
  notificationDot: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryGreen,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  avatarPlaceholder: { borderWidth: 1, borderColor: COLORS.border },

  // Greeting
  greetingContainer: { paddingHorizontal: 16, marginTop: 16, marginBottom: 6 },
  greetingText: { fontFamily: FONT.semibold, fontSize: 18, color: COLORS.primaryText },

  // Hero
  heroContainer: { paddingHorizontal: 16, marginBottom: 24, position: 'relative' },
  heroHeadline: {
    fontFamily: FONT.bold,
    fontSize: 32,
    color: COLORS.primaryText,
    lineHeight: 40,
    letterSpacing: -0.5,
    maxWidth: '80%',
  },
  heroLeafPlaceholder: {
    position: 'absolute',
    right: 0,
    top: -6,
    backgroundColor: 'transparent',
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  searchLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  searchPlaceholderText: { fontFamily: FONT.regular, fontSize: 15, color: COLORS.secondaryText, flex: 1 },
  scanIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.softGreen,
    borderWidth: 1,
    borderColor: '#CFE9D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Delivery Card
  deliveryCard: {
    backgroundColor: COLORS.softGreen,
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  deliveryCardLeft: { flex: 1 },
  deliveryInText: { fontFamily: FONT.medium, fontSize: 14, color: COLORS.secondaryText, marginBottom: 4 },
  deliveryTimeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  deliveryTimeText: { fontFamily: FONT.extrabold, fontSize: 36, color: COLORS.deepGreen, letterSpacing: -0.5 },
  deliveryTimeMin: { fontFamily: FONT.bold, fontSize: 20 },
  storeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  storeText: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.secondaryText },
  storeHighlight: { fontFamily: FONT.semibold, color: COLORS.primaryGreen },
  onTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  onTimeText: { fontFamily: FONT.semibold, fontSize: 12, color: COLORS.successGreen },
  deliveryCardRight: { justifyContent: 'center', alignItems: 'flex-end' },

  // Category Row
  categoryScroll: { paddingHorizontal: 16, marginBottom: 24 },
  categoryItem: { alignItems: 'center', marginRight: 20, width: 72 },
  categoryImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 1,
    overflow: 'hidden',
  },
  categoryName: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: COLORS.primaryText,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Promotional Banner
  promoBanner: {
    backgroundColor: COLORS.deepGreen,
    marginHorizontal: 16,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    overflow: 'hidden',
  },
  promoLeft: { flex: 1 },
  promoHeadline: { fontFamily: FONT.bold, fontSize: 22, color: COLORS.surface, marginBottom: 4 },
  promoHighlight: { color: COLORS.limeAccent },
  promoSub: { fontFamily: FONT.regular, fontSize: 14, color: '#D1FAE5', marginBottom: 12 },
  promoCodePill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  promoCodeText: { fontFamily: FONT.semibold, color: COLORS.surface, fontSize: 12, letterSpacing: 1 },
  promoRight: { flexDirection: 'row', alignItems: 'center' },
  promoArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  // Popular Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontFamily: FONT.bold, fontSize: 18, color: COLORS.primaryText, letterSpacing: -0.2 },
  seeAllRow: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { fontFamily: FONT.semibold, fontSize: 14, color: COLORS.primaryGreen, marginRight: 2 },

  // Product Cards
  productScroll: { paddingHorizontal: 16 },
  productCard: {
    width: 148,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  productImageWrapper: { position: 'relative', alignItems: 'center', marginBottom: 12 },
  timeBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  timeBadgeText: { fontFamily: FONT.bold, fontSize: 10, color: COLORS.primaryGreen },
  favoriteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 13,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: { flex: 1, justifyContent: 'space-between' },
  productName: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryText, marginBottom: 4, lineHeight: 18 },
  productQty: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.secondaryText, marginBottom: 12 },
  productBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontFamily: FONT.bold, fontSize: 15, color: COLORS.primaryText },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyControlSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 10,
    height: 32,
    width: 72,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  qtyBtnSmall: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnTextSmall: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyTextSmall: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
