import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { assets } from '../../assets';
import { useStore } from '../../store/StoreContext';

const COLORS = {
  background: '#F8FAF7',
  surface: '#FFFFFF',
  primaryGreen: '#16A34A',
  deepGreen: '#087443',
  softGreen: '#EAF7EE',
  primaryText: '#111814',
  secondaryText: '#6B756E',
  border: '#E5EAE6',
  successGreen: '#22C55E',
  mutedText: '#A1A1AA',
};

const ImagePlaceholder = ({ width, height, borderRadius = 0, style, source }) => {
  if (source) {
    return <Image source={{ uri: source }} style={[{ width, height, borderRadius }, style]} />;
  }
  return <View style={[{ width, height, borderRadius, backgroundColor: '#E5EAE6' }, style]} />;
};

// Basic simple icons using text for no external dependencies
const IconHeart = () => <Text style={{ fontSize: 22, color: COLORS.primaryText }}>♡</Text>;
const IconTrash = () => <Text style={{ fontSize: 20, color: COLORS.primaryGreen }}>🗑</Text>;
const IconChevronDown = () => <Text style={{ fontSize: 12, color: COLORS.secondaryText, marginLeft: 4 }}>▼</Text>;
const IconChevronRight = () => <Text style={{ fontSize: 16, color: COLORS.primaryGreen }}>›</Text>;
const IconBolt = () => <Text style={{ color: COLORS.primaryGreen, fontSize: 14 }}>⚡</Text>;
const IconSearchLight = () => <Text style={{ fontSize: 16, color: COLORS.surface, marginRight: 8 }}>🔍</Text>;
const IconTag = () => <Text style={{ fontSize: 18, color: COLORS.primaryGreen }}>🏷</Text>;
const IconBag = () => <Text style={{ fontSize: 16, color: COLORS.primaryGreen }}>🛍</Text>;
const IconCalendar = () => <Text style={{ fontSize: 20, color: COLORS.primaryGreen }}>📅</Text>;
const IconHome = ({ active }) => <Text style={{ fontSize: 24, color: active ? COLORS.primaryGreen : COLORS.secondaryText }}>🏠</Text>;
const IconSearchNav = ({ active }) => <Text style={{ fontSize: 24, color: active ? COLORS.primaryGreen : COLORS.secondaryText }}>🔍</Text>;
const IconCartSolid = ({ active }) => <Text style={{ fontSize: 24, color: active ? COLORS.surface : COLORS.surface }}>🛒</Text>;
const IconOrders = ({ active }) => <Text style={{ fontSize: 24, color: active ? COLORS.primaryGreen : COLORS.secondaryText }}>🛍</Text>;
const IconProfile = ({ active }) => <Text style={{ fontSize: 24, color: active ? COLORS.primaryGreen : COLORS.secondaryText }}>👤</Text>;

// Data
const RECOMMENDATIONS = [
  { id: '1', name: 'Amul Taaza Milk', size: '1 L', price: '₹68', time: '8 min', image: assets.cart.milk },
  { id: '2', name: 'Britannia Bread', size: '400 g', price: '₹35', time: '10 min', image: assets.cart.bread },
  { id: '3', name: 'Maggi Noodles', size: '70 g', price: '₹20', time: '8 min', image: assets.search.maggi },
  { id: '4', name: 'Banana', size: '1 kg (7-8 pcs)', price: '₹48', time: '10 min', image: assets.cart.banana },
];

const CART_ITEMS = [
  { id: '1', name: 'Amul Taaza Milk', size: '1 L · Pouch', price: '₹68', oldPrice: '₹76', discount: '10% OFF', time: '8 min', image: assets.cart.milk, qty: 1 },
  { id: '2', name: 'Britannia Brown Bread', size: '400 g', price: '₹35', oldPrice: '₹40', discount: '12% OFF', time: '8 min', image: assets.cart.bread, qty: 1 },
  { id: '3', name: 'Banana', size: '1 kg (7-8 pcs)', price: '₹48', oldPrice: null, discount: null, time: '10 min', image: assets.cart.banana, qty: 1 },
];

const ADD_ON_ITEMS = [
  { id: '1', name: 'Amul Butter', size: '100 g', image: assets.cart.butter },
  { id: '2', name: 'Farm Eggs', size: '6 pcs', image: assets.cart.eggs },
  { id: '3', name: 'Quaker Oats', size: '500 g', image: assets.cart.oats },
  { id: '4', name: 'Tata Tea', size: '250 g', image: assets.cart.tea },
];

const CartScreen = ({ onNavigate }) => {
  const { state, updateCartQty, removeFromCart, addToCart } = useStore();
  const isEmpty = state.cart.length === 0;

  // Derive cart items from state
  const cartItems = state.cart.map(cartItem => {
    const product = state.products.find(p => p.id === cartItem.productId);
    return { ...product, qty: cartItem.qty };
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  
  const deliveryFee = cartTotal > 0 && cartTotal < 299 ? 25 : 0;
  const packagingFee = 10;
  const finalAmount = cartTotal + deliveryFee + packagingFee;
  const amountToFreeDelivery = 299 - cartTotal;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <SafeAreaView style={{ flex: 1 }}>
        {/* 1. HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <TouchableOpacity onPress={() => onNavigate('Home')} style={{ marginRight: 12 }}>
              <Text style={{ fontSize: 24, color: COLORS.primaryText }}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Your Cart</Text>
            <View style={styles.itemCountPill}>
              <Text style={styles.itemCountText}>{totalItems} items</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}><IconHeart /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><IconTrash /></TouchableOpacity>
          </View>
        </View>

        {/* 2. DELIVERY LOCATION */}
        <TouchableOpacity style={styles.locationRow}>
          <Text style={styles.deliveringTo}>Delivering to <Text style={styles.locationHighlight}>Home</Text> · Jaipur</Text>
          <IconChevronDown />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 3. FREE DELIVERY PROGRESS CARD */}
          <View style={styles.progressCard}>
            <View style={styles.progressIconWrapper}>
              <IconBolt />
            </View>
            <View style={styles.progressContent}>
              {isEmpty ? (
                <>
                  <Text style={styles.progressMain}>Add items worth <Text style={styles.progressHighlight}>₹299</Text> to get <Text style={styles.progressHighlight}>FREE</Text> delivery</Text>
                  <Text style={styles.progressSub}>Shop more, save more!</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '0%' }]} />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.progressMain}>Great choice! You’re saving <Text style={styles.progressHighlight}>₹36</Text> on this order</Text>
                  <Text style={styles.progressSub}>Add ₹214 more to unlock <Text style={styles.progressHighlight}>FREE</Text> delivery</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBarBgShort}>
                      <View style={[styles.progressBarFill, { width: '30%' }]} />
                    </View>
                    <Text style={styles.progressToGo}>₹214 to go</Text>
                  </View>
                </>
              )}
            </View>
            <View style={styles.progressRight}>
              <IconChevronRight />
            </View>
          </View>

          {/* DYNAMIC CONTENT */}
          {isEmpty ? (
            /* EMPTY CART STATE */
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIllustrationWrapper}>
                {/* CART_EMPTY_ILLUSTRATION Placeholder */}
                <ImagePlaceholder width={180} height={160} borderRadius={20} />
              </View>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySub}>
                Looks like you haven't added anything yet.{"\n"}
                Start shopping for fresh essentials!
              </Text>
              
              <TouchableOpacity style={styles.startShoppingBtn} onPress={() => onNavigate('Home')}>
                <IconSearchLight />
                <Text style={styles.startShoppingText}>Start shopping  ›</Text>
              </TouchableOpacity>

              {/* RECOMMENDATIONS */}
              <View style={styles.recSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>You might need these</Text>
                  <TouchableOpacity><Text style={styles.seeAllText}>See all  ›</Text></TouchableOpacity>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recScroll}>
                  {state.products.slice(0, 4).map(item => (
                    <TouchableOpacity key={item.id} style={styles.recCard} onPress={() => onNavigate({ name: 'Product', params: { id: item.id } })}>
                      <View style={styles.recImageWrapper}>
                        <ImagePlaceholder width={90} height={90} borderRadius={12} source={item.image} />
                        <View style={styles.timeBadge}>
                          <IconBolt />
                          <Text style={styles.timeBadgeText}> {item.time}</Text>
                        </View>
                        <TouchableOpacity style={styles.favBtn}><IconHeart /></TouchableOpacity>
                      </View>
                      <Text style={styles.recName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.recSize}>{item.size}</Text>
                      <View style={styles.recBottomRow}>
                        <Text style={styles.recPrice}>₹{item.price}</Text>
                        <TouchableOpacity style={styles.recAddBtn} onPress={() => addToCart(item.id, 1)}><Text style={styles.recAddBtnText}>+</Text></TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          ) : (
            /* FULL CART STATE */
            <View style={styles.fullContainer}>
              {/* CART ITEMS */}
              <View style={styles.cartItemsContainer}>
                {cartItems.map((item, index) => (
                  <View key={item.id} style={[styles.cartItem, index === cartItems.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.cartItemImageWrapper}>
                      <ImagePlaceholder width={70} height={70} borderRadius={10} source={item.image} />
                    </View>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemSize}>{item.size}</Text>
                      <View style={styles.cartItemTimeBadge}>
                        <IconBolt />
                        <Text style={styles.cartItemTimeText}> {item.time}</Text>
                      </View>
                      <View style={styles.cartItemPriceRow}>
                        <Text style={styles.cartItemPrice}>₹{item.price}</Text>
                        {item.oldPrice && <Text style={styles.cartItemOldPrice}>₹{item.oldPrice}</Text>}
                        {item.discount && <Text style={styles.cartItemDiscount}>{item.discount}</Text>}
                      </View>
                    </View>
                    <View style={styles.cartItemRight}>
                      <View style={styles.cartItemTopRight}>
                        <TouchableOpacity style={styles.saveForLaterBtn}><Text style={styles.saveForLaterText}>Save for later</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}><IconTrash /></TouchableOpacity>
                      </View>
                      <View style={styles.qtyControl}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQty(item.id, item.qty - 1)}>
                          <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.qty}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQty(item.id, item.qty + 1)}>
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* ADD-ON PRODUCTS */}
              <View style={styles.addOnSection}>
                <View style={styles.addOnHeader}>
                  <IconBag />
                  <Text style={styles.addOnTitle}>Add these items with your order</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.addOnScroll}>
                  {state.products.slice(4, 8).map(item => (
                    <TouchableOpacity key={item.id} style={styles.addOnCard} onPress={() => onNavigate({ name: 'Product', params: { id: item.id } })}>
                      <ImagePlaceholder width={50} height={50} borderRadius={8} source={item.image} />
                      <View style={styles.addOnInfo}>
                        <Text style={styles.addOnName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.addOnSize}>{item.size}</Text>
                      </View>
                      <TouchableOpacity style={styles.addOnBtn} onPress={() => addToCart(item.id, 1)}><Text style={styles.addOnBtnText}>+</Text></TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* OFFERS & COUPONS */}
          <TouchableOpacity style={styles.offersRow}>
            <View style={styles.offersLeft}>
              <View style={styles.offersIconWrapper}><IconTag /></View>
              <View>
                <Text style={styles.offersTitle}>Offers & Coupons</Text>
                <Text style={styles.offersSub}>Save extra with best offers</Text>
              </View>
            </View>
            <View style={styles.offersPill}>
              <Text style={styles.offersPillText}>{isEmpty ? 'View offers' : '1 offer applied'}  ›</Text>
            </View>
          </TouchableOpacity>

          {/* PRICE DETAILS (FULL STATE ONLY) */}
          {!isEmpty && (
            <View style={styles.priceDetailsSection}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Item total ({totalItems} items)</Text>
                <Text style={styles.priceValue}>₹{cartTotal}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery fee ⓘ</Text>
                <View style={styles.priceValueRow}>
                  {deliveryFee === 0 ? (
                    <>
                      <Text style={styles.priceOldValue}>₹25</Text>
                      <Text style={styles.priceFreeValue}>FREE</Text>
                    </>
                  ) : (
                    <Text style={styles.priceValue}>₹{deliveryFee}</Text>
                  )}
                </View>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Packaging fee ⓘ</Text>
                <View style={styles.priceValueRow}>
                  <Text style={styles.priceValue}>₹{packagingFee}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 160 }} /> 
        </ScrollView>
      </SafeAreaView>

      {/* BOTTOM SUMMARY */}
      <View style={styles.bottomSummary}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>To Pay</Text>
          <Text style={styles.summaryAmount}>{isEmpty ? '₹0' : `₹${finalAmount}`}</Text>
        </View>
        <View style={styles.summaryMiddle}>
          <IconCalendar />
          <View style={{ marginLeft: 6 }}>
            <Text style={styles.summaryDeliveryLabel}>Delivery in</Text>
            <Text style={styles.summaryDeliveryTime}>8–12 min</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.checkoutBtn, isEmpty && styles.checkoutBtnDisabled]} disabled={isEmpty} onPress={() => onNavigate('Checkout')}>
          <Text style={styles.checkoutBtnText}>Proceed to checkout  ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  // Dev Toggle
  devToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 6,
    gap: 8,
  },
  devToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  devToggleActive: { backgroundColor: COLORS.primaryGreen, borderColor: COLORS.primaryGreen },
  devToggleText: { fontSize: 11, color: '#AAA' },
  devToggleTextActive: { color: '#FFF', fontWeight: 'bold' },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.primaryText },
  itemCountPill: {
    backgroundColor: COLORS.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  itemCountText: { fontSize: 11, fontWeight: '700', color: COLORS.primaryGreen },
  headerRight: { flexDirection: 'row', gap: 16 },
  iconBtn: { padding: 4 },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  deliveringTo: { fontSize: 13, color: COLORS.secondaryText },
  locationHighlight: { color: COLORS.primaryText, fontWeight: '700' },

  scrollContent: {
    paddingBottom: 130, // Updated for floating nav
  },

  // Progress Card
  progressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.softGreen,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  progressIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressContent: { flex: 1 },
  progressMain: { fontSize: 13, color: COLORS.primaryText, fontWeight: '500', marginBottom: 2 },
  progressHighlight: { color: COLORS.primaryGreen, fontWeight: '700' },
  progressSub: { fontSize: 12, color: COLORS.secondaryText, marginBottom: 8 },
  progressBarBg: { height: 4, backgroundColor: 'rgba(22, 163, 74, 0.2)', borderRadius: 2 },
  progressBarBgShort: { flex: 1, height: 4, backgroundColor: 'rgba(22, 163, 74, 0.2)', borderRadius: 2, marginRight: 12 },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primaryGreen, borderRadius: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressToGo: { fontSize: 11, color: COLORS.secondaryText },
  progressRight: { marginLeft: 12 },

  // Empty State
  emptyContainer: { alignItems: 'center', paddingHorizontal: 16 },
  emptyIllustrationWrapper: { marginBottom: 24 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primaryText, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.secondaryText, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  startShoppingBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  startShoppingText: { color: COLORS.surface, fontSize: 16, fontWeight: '600' },

  // Rec Section
  recSection: { width: '100%' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primaryText },
  seeAllText: { fontSize: 14, fontWeight: '600', color: COLORS.primaryGreen },
  recScroll: { paddingRight: 16 },
  recCard: {
    width: 130,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recImageWrapper: { position: 'relative', alignItems: 'center', marginBottom: 12 },
  timeBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    elevation: 2,
  },
  timeBadgeText: { fontSize: 9, fontWeight: '700', color: COLORS.primaryGreen },
  favBtn: { position: 'absolute', top: 4, right: 4 },
  recName: { fontSize: 13, fontWeight: '600', color: COLORS.primaryText, marginBottom: 4 },
  recSize: { fontSize: 12, color: COLORS.secondaryText, marginBottom: 8 },
  recBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recPrice: { fontSize: 15, fontWeight: '700', color: COLORS.primaryText },
  recAddBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.softGreen, alignItems: 'center', justifyContent: 'center' },
  recAddBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.primaryGreen },

  // Full State
  fullContainer: { paddingHorizontal: 16 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartItemImageWrapper: { marginRight: 12 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '600', color: COLORS.primaryText, marginBottom: 4 },
  cartItemSize: { fontSize: 12, color: COLORS.secondaryText, marginBottom: 8 },
  cartItemTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softGreen,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  cartItemTimeText: { fontSize: 10, fontWeight: '700', color: COLORS.primaryGreen },
  cartItemPriceRow: { flexDirection: 'row', alignItems: 'baseline' },
  cartItemPrice: { fontSize: 16, fontWeight: '700', color: COLORS.primaryText, marginRight: 8 },
  cartItemOldPrice: { fontSize: 12, color: COLORS.secondaryText, textDecorationLine: 'line-through', marginRight: 8 },
  cartItemDiscount: { fontSize: 11, fontWeight: '700', color: COLORS.successGreen },
  cartItemRight: { justifyContent: 'space-between', alignItems: 'flex-end' },
  cartItemTopRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  saveForLaterBtn: { backgroundColor: COLORS.softGreen, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  saveForLaterText: { fontSize: 10, fontWeight: '600', color: COLORS.primaryGreen },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.softGreen, borderRadius: 8 },
  qtyBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, color: COLORS.primaryGreen, fontWeight: '600' },
  qtyText: { fontSize: 14, fontWeight: '700', color: COLORS.primaryText, marginHorizontal: 4 },

  addOnSection: { backgroundColor: COLORS.softGreen, borderRadius: 16, padding: 16, marginTop: 12, marginBottom: 24 },
  addOnHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addOnTitle: { fontSize: 13, fontWeight: '600', color: COLORS.primaryText, marginLeft: 8 },
  addOnScroll: { paddingRight: 16, gap: 12 },
  addOnCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    width: 160,
  },
  addOnInfo: { flex: 1, marginLeft: 8 },
  addOnName: { fontSize: 12, fontWeight: '600', color: COLORS.primaryText },
  addOnSize: { fontSize: 11, color: COLORS.secondaryText, marginTop: 2 },
  addOnBtn: { width: 24, height: 24, borderRadius: 6, backgroundColor: COLORS.softGreen, alignItems: 'center', justifyContent: 'center' },
  addOnBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.primaryGreen },

  // Offers
  offersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  offersLeft: { flexDirection: 'row', alignItems: 'center' },
  offersIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  offersTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primaryText, marginBottom: 2 },
  offersSub: { fontSize: 12, color: COLORS.secondaryText },
  offersPill: { backgroundColor: COLORS.softGreen, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  offersPillText: { fontSize: 11, fontWeight: '700', color: COLORS.primaryGreen },

  // Price Details
  priceDetailsSection: { marginHorizontal: 16, marginBottom: 24, backgroundColor: COLORS.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { fontSize: 13, color: COLORS.secondaryText },
  priceValue: { fontSize: 13, color: COLORS.primaryText, fontWeight: '600' },
  priceValueRow: { flexDirection: 'row', gap: 8 },
  priceOldValue: { fontSize: 13, color: COLORS.secondaryText, textDecorationLine: 'line-through' },
  priceFreeValue: { fontSize: 13, color: COLORS.successGreen, fontWeight: '700' },
  priceSaveLabel: { fontSize: 14, color: COLORS.successGreen, fontWeight: '700' },
  priceSaveValue: { fontSize: 14, color: COLORS.successGreen, fontWeight: '700' },

  // Bottom Summary
  bottomSummary: {
    position: 'absolute',
    bottom: 0, 
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryLeft: { marginRight: 20 },
  summaryLabel: { fontSize: 12, color: COLORS.secondaryText, fontWeight: '600', marginBottom: 2 },
  summaryAmount: { fontSize: 20, fontWeight: '800', color: COLORS.primaryText },
  summaryMiddle: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  summaryDeliveryLabel: { fontSize: 11, color: COLORS.secondaryText },
  summaryDeliveryTime: { fontSize: 13, fontWeight: '700', color: COLORS.primaryGreen },
  checkoutBtn: {
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  checkoutBtnDisabled: { backgroundColor: COLORS.border },
  checkoutBtnText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  }
});

export default CartScreen;
