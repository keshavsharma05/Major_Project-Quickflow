import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { assets } from '../../assets';
import BottomNavigation from '../../components/BottomNavigation';

/**
 * Same "Outfit" family used on HomeScreen — see HomeScreen.js for the
 * expo-font loader snippet. Falls back to system font if not loaded.
 */
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
  deepGreen: '#087443',
  softGreen: '#EAF7EE',
  primaryText: '#111814',
  secondaryText: '#6B756E',
  tertiaryText: '#9AA5A0',
  border: '#E5EAE6',
  successGreen: '#22C55E',
  dangerRed: '#EF4444',
  tabTrack: '#EEF2EE',
  shadow: 'rgba(17, 24, 20, 0.05)',
};

// Reserved slot for any image (product photo, map, illustration) — plain
// placeholder box, sized/rounded per spot, ready for real assets later.
const ImagePlaceholder = ({ width, height, borderRadius = 0, style, source }) => (
  <View style={[{ width, height, borderRadius, backgroundColor: '#E5EAE6', overflow: 'hidden' }, style]}>
    {source && <Image source={{ uri: source }} style={{ width: '100%', height: '100%' }} />}
  </View>
);

// ---------------------------------------------------------------------------
// Dummy data (unchanged)
// ---------------------------------------------------------------------------

const ORDER_HISTORY = [
  { id: '1', status: 'Delivered', date: 'Today, 11:42 AM', items: 3, total: '₹151', products: [assets.cart.milk, assets.cart.bread, assets.cart.banana], extraItems: 0, showOrderAgain: true },
  { id: '2', status: 'Delivered', date: 'Yesterday, 7:24 PM', items: 5, total: '₹340', products: [assets.cart.eggs, assets.cart.oats, assets.cart.milk], extraItems: 2, showOrderAgain: true },
  { id: '3', status: 'Delivered', date: '28 Aug, 11:20 AM', items: 4, total: '₹278', products: [assets.cart.bread, assets.cart.banana, assets.cart.milk], extraItems: 1, showOrderAgain: true },
  { id: '4', status: 'Cancelled', date: '27 Aug, 3:11 PM', items: 2, total: '₹94', products: [assets.cart.milk, assets.cart.bread], extraItems: 0, showOrderAgain: false },
];

const BUY_AGAIN = [
  { id: '1', name: 'Amul Taaza Milk', size: '1 L', price: '₹68', image: assets.cart.milk },
  { id: '2', name: 'Britannia Brown Bread', size: '400 g', price: '₹40', image: assets.cart.bread },
  { id: '3', name: 'Banana', size: '1 kg', price: '₹48', image: assets.cart.banana },
  { id: '4', name: 'Farm Eggs', size: '6 pcs', price: '₹42', image: assets.cart.eggs },
  { id: '5', name: 'Quaker Oats', size: '500 g', price: '₹110', image: assets.cart.oats },
];

const MIGHT_LIKE = [
  { id: '1', name: 'Maggi Masala', size: '280 g', price: '₹28', image: assets.search.maggi },
  { id: '2', name: 'Tata Tea Premium', size: '250 g', price: '₹120', image: assets.cart.tea },
  { id: '3', name: 'Amul Butter', size: '100 g', price: '₹55', image: assets.cart.butter },
  { id: '4', name: "Lay's Classic", size: '52 g', price: '₹20', image: null },
  { id: '5', name: 'Haldiram', size: '200 g', price: '₹45', image: null },
];

const FILTER_TABS = ['All', 'Active', 'Completed', 'Cancelled'];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

const ProductCard = ({ item, onAdd }) => (
  <TouchableOpacity style={styles.productCard} activeOpacity={0.85}>
    <View style={styles.productImageWrapper}>
      <ImagePlaceholder width={'100%'} height={110} borderRadius={12} source={item.image} />
    </View>
    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
    <Text style={styles.productSize}>{item.size}</Text>
    <View style={styles.productBottomRow}>
      <Text style={styles.productPrice}>₹{item.price}</Text>
      <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={onAdd}>
        <Feather name="plus" size={16} color={COLORS.primaryGreen} />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const FilterTabs = ({ active, onChange }) => (
  <View style={styles.tabsTrack}>
    {FILTER_TABS.map((tab, index) => {
      const isActive = tab === active;
      const prevActive = index > 0 && FILTER_TABS[index - 1] === active;
      return (
        <TouchableOpacity
          key={tab}
          style={[styles.tabItem, isActive && styles.tabItemActive]}
          onPress={() => onChange(tab)}
          activeOpacity={0.8}
        >
          {index > 0 && !isActive && !prevActive && <View style={styles.tabDivider} />}
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

import { useStore } from '../../store/StoreContext';
import { Image } from 'react-native';

const OrdersScreen = ({ onNavigate }) => {
  const { state, addToCart } = useStore();
  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const [activeFilter, setActiveFilter] = useState('All');

  // Generate dynamic buy again and might like from products
  const buyAgainItems = state.products.slice(0, 5);
  const mightLikeItems = state.products.slice(5, 10);

  const renderActiveOrder = (order) => {
    const totalItems = order.items.reduce((s, i) => s + i.qty, 0);
    return (
    <View style={styles.primaryCard}>
      <View style={styles.primaryCardHeader}>
        <View style={styles.statusBadge}>
          <View style={styles.dotActive} />
          <Text style={styles.statusTextActive}>ON THE WAY</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.dotLive} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>
      <Text style={styles.orderId}>Order #{order.id}</Text>
      <Text style={styles.etaText}>Arriving in <Text style={{ fontFamily: FONT.bold }}>8 min</Text></Text>

      {/* MAP — reserved slot, left empty for the real map component */}
      <View style={styles.mapContainer}>
        <ImagePlaceholder width={'100%'} height={140} borderRadius={16} />
      </View>

      <View style={styles.routeLegend}>
        <View style={styles.legendItem}>
          <Ionicons name="storefront-outline" size={14} color={COLORS.primaryGreen} />
          <Text style={styles.legendText}>Store</Text>
        </View>
        <Text style={styles.legendDots}>. . . . . . . . . .</Text>
        <View style={styles.legendItem}>
          <MaterialCommunityIcons name="moped" size={16} color={COLORS.primaryGreen} />
          <Text style={styles.legendTextActive}>Rider</Text>
        </View>
        <Text style={styles.legendDots}>. . . . . . . . . .</Text>
        <View style={styles.legendItem}>
          <Feather name="home" size={14} color={COLORS.tertiaryText} />
          <Text style={styles.legendTextMuted}>Home</Text>
        </View>
      </View>

      <View style={styles.activeOrderBottom}>
        <View style={styles.activeOrderItems}>
          <Feather name="shopping-bag" size={17} color={COLORS.primaryGreen} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.activeItemsCount}>{totalItems} items</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.activeViewItems}>View items</Text>
              <Feather name="chevron-down" size={12} color={COLORS.secondaryText} style={{ marginLeft: 3 }} />
            </View>
          </View>
        </View>
        <View style={styles.activeOrderDivider} />
        <View style={styles.activeOrderTotal}>
          <Text style={styles.activeItemsCount}>₹{order.totalAmount || order.total}</Text>
          <Text style={styles.activeViewItems}>Total amount</Text>
        </View>
        <TouchableOpacity style={styles.trackBtn} activeOpacity={0.85} onPress={() => onNavigate && onNavigate('LiveOrderTracking')}>
          <Text style={styles.trackBtnText}>Track order</Text>
          <Feather name="chevron-right" size={15} color={COLORS.surface} />
        </TouchableOpacity>
      </View>
    </View>
  )};

  const renderCompletedOrder = (order) => {
    const totalItems = order.items.reduce((s, i) => s + i.qty, 0);
    const orderImages = order.items.map(cartItem => state.products.find(p => p.id === cartItem.productId)?.image).filter(Boolean);
    return (
    <View style={styles.primaryCard}>
      <View style={styles.statusBadgeCompleted}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.primaryGreen} />
        <Text style={styles.statusTextCompleted}>DELIVERED</Text>
      </View>
      <Text style={styles.orderId}>Order #{order.id}</Text>
      <Text style={styles.completedDate}>Just Now</Text>

      <View style={styles.completedProductsRow}>
        {orderImages.slice(0, 3).map((img, i) => (
          <View key={i} style={styles.completedProductImg}><ImagePlaceholder width={44} height={44} borderRadius={8} source={img} /></View>
        ))}
        {orderImages.length > 3 && <View style={styles.completedMoreImg}><Text style={styles.completedMoreText}>+{orderImages.length - 3}</Text></View>}
      </View>

      <View style={styles.completedSummaryRow}>
        <Text style={styles.completedSummaryText}>{totalItems} items  ·  ₹{order.totalAmount || order.total}</Text>
        <View style={styles.paidBadge}><Text style={styles.paidBadgeText}>Paid</Text></View>
      </View>

      <View style={styles.completedSeparator} />

      <View style={styles.completedDetailsRow}>
        <View style={styles.completedDetailBlock}>
          <View style={styles.completedDetailHeader}>
            <Feather name="map-pin" size={13} color={COLORS.primaryGreen} />
            <Text style={styles.completedDetailLabel}>Delivered to</Text>
          </View>
          <Text style={styles.completedDetailValue}>Home · Jaipur</Text>
        </View>
        <View style={styles.completedDetailBlock}>
          <View style={styles.completedDetailHeader}>
            <Feather name="clock" size={13} color={COLORS.primaryGreen} />
            <Text style={styles.completedDetailLabel}>Delivery time</Text>
          </View>
          <Text style={styles.completedDetailValue}>11:34 AM · 8 min</Text>
        </View>
      </View>

      {/* Reserved slot for the delivery-route thumbnail seen top-right in the reference */}
      <View style={styles.completedActionsRow}>
        <TouchableOpacity style={styles.viewDetailsBtn} activeOpacity={0.8} onPress={() => onNavigate && onNavigate('OrderConfirmation')}>
          <Text style={styles.viewDetailsText}>View order details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderAgainBtn} activeOpacity={0.85}>
          <Text style={styles.orderAgainText}>Order again</Text>
        </TouchableOpacity>
      </View>
    </View>
  )};

  const renderEmptyOrder = () => (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIllustration}>
        {/* Reserved slot for the "no orders" illustration */}
        <ImagePlaceholder width={150} height={180} borderRadius={16} style={{ backgroundColor: 'rgba(180, 200, 185, 0.25)' }} />
      </View>
      <View style={styles.emptyTextBlock}>
        <Text style={styles.emptyTitle}>No active orders</Text>
        <Text style={styles.emptySub}>
          You haven't placed any orders yet. Your first order is just a few taps away!
        </Text>
        <TouchableOpacity style={styles.startShoppingBtn} onPress={() => onNavigate('Home')} activeOpacity={0.85}>
          <Text style={styles.startShoppingText}>Start shopping</Text>
          <Feather name="arrow-right" size={15} color={COLORS.surface} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Orders</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
              <Feather name="search" size={21} color={COLORS.primaryText} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
              <Feather name="more-vertical" size={21} color={COLORS.primaryText} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* FILTER TABS */}
        <FilterTabs active={activeFilter} onChange={setActiveFilter} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {state.activeOrder ? renderActiveOrder(state.activeOrder) : (state.orders.length > 0 ? renderCompletedOrder(state.orders[0]) : renderEmptyOrder())}

          {/* ORDER HISTORY */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order History</Text>
              <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
                <Text style={styles.seeAllText}>See all</Text>
                <Feather name="chevron-right" size={15} color={COLORS.primaryGreen} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {state.orders.map((order) => {
                const totalItems = order.items.reduce((s, i) => s + i.qty, 0);
                const orderImages = order.items.map(cartItem => state.products.find(p => p.id === cartItem.productId)?.image).filter(Boolean);
                return (
                <View key={order.id} style={styles.historyCard}>
                  <View style={styles.historyCardHeader}>
                    <Ionicons
                      name={order.status === 'Cancelled' ? 'close-circle' : 'checkmark-circle'}
                      size={15}
                      color={order.status === 'Cancelled' ? COLORS.dangerRed : COLORS.primaryGreen}
                    />
                    <Text style={[styles.historyStatusText, order.status === 'Cancelled' && { color: COLORS.dangerRed }]}>
                      {order.status}
                    </Text>
                    <Feather name="chevron-right" size={15} color={COLORS.tertiaryText} />
                  </View>
                  <Text style={styles.historyDate}>{order.date}</Text>

                  <View style={styles.historyImagesRow}>
                    {orderImages.slice(0, 3).map((img, i) => (
                      <View key={i} style={styles.historyProductImg}><ImagePlaceholder width={34} height={34} borderRadius={6} source={img} /></View>
                    ))}
                    {orderImages.length > 3 && (
                      <View style={styles.historyMoreImg}><Text style={styles.historyMoreText}>+{orderImages.length - 3}</Text></View>
                    )}
                  </View>

                  <Text style={styles.historySummaryText}>{totalItems} items  ·  ₹{order.totalAmount || order.total}</Text>

                  <TouchableOpacity
                    style={order.status === 'Delivered' ? styles.historyOrderAgainBtn : styles.historyViewDetailsBtn}
                    activeOpacity={0.8}
                    onPress={() => order.status !== 'Delivered' && onNavigate && onNavigate('OrderConfirmation')}
                  >
                    <Text style={order.status === 'Delivered' ? styles.historyOrderAgainText : styles.historyViewDetailsText}>
                      {order.status === 'Delivered' ? 'Order again' : 'View details'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )})}
            </ScrollView>
          </View>

          {/* BUY AGAIN */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Buy Again</Text>
              <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
                <Text style={styles.seeAllText}>See all</Text>
                <Feather name="chevron-right" size={15} color={COLORS.primaryGreen} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {buyAgainItems.map((item) => <ProductCard key={item.id} item={item} onAdd={() => addToCart(item.id)} />)}
            </ScrollView>
          </View>

          {/* YOU MIGHT LIKE THESE */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>You might like these</Text>
              <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
                <Text style={styles.seeAllText}>See all</Text>
                <Feather name="chevron-right" size={15} color={COLORS.primaryGreen} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {mightLikeItems.map((item) => <ProductCard key={item.id} item={item} onAdd={() => addToCart(item.id)} />)}
            </ScrollView>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      <BottomNavigation activeTab="Orders" onNavigate={onNavigate} cartCount={cartCount} />
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
    marginBottom: 16,
  },
  headerTitle: { fontFamily: FONT.extrabold, fontSize: 26, color: COLORS.primaryText, letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  headerBtn: { position: 'relative' },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primaryGreen,
    borderWidth: 1,
    borderColor: COLORS.background,
  },

  // Filter tabs
  tabsTrack: {
    flexDirection: 'row',
    backgroundColor: COLORS.tabTrack,
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: COLORS.primaryGreen,
    shadowColor: COLORS.primaryGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  tabDivider: {
    position: 'absolute',
    left: 0,
    top: '25%',
    bottom: '25%',
    width: 1,
    backgroundColor: '#D7DED9',
  },
  tabText: { fontFamily: FONT.medium, fontSize: 13, color: COLORS.secondaryText },
  tabTextActive: { fontFamily: FONT.bold, color: COLORS.surface },

  // Primary order card (shared shell)
  primaryCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 32,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontFamily: FONT.extrabold, fontSize: 18, color: COLORS.primaryText, marginBottom: 4, letterSpacing: -0.2 },

  // Active state
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primaryGreen, marginRight: 6 },
  statusTextActive: { fontFamily: FONT.bold, fontSize: 11, color: COLORS.primaryGreen, letterSpacing: 0.5 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.softGreen, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12 },
  dotLive: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primaryGreen, marginRight: 5 },
  liveText: { fontFamily: FONT.bold, fontSize: 11, color: COLORS.primaryGreen },
  etaText: { fontFamily: FONT.medium, fontSize: 14, color: COLORS.primaryGreen, marginBottom: 16 },
  mapContainer: { width: '100%', borderRadius: 16, marginBottom: 14, overflow: 'hidden' },
  routeLegend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendText: { fontFamily: FONT.medium, fontSize: 11.5, color: COLORS.secondaryText },
  legendTextActive: { fontFamily: FONT.bold, fontSize: 11.5, color: COLORS.primaryGreen },
  legendTextMuted: { fontFamily: FONT.medium, fontSize: 11.5, color: COLORS.tertiaryText },
  legendDots: { fontSize: 10, color: '#D1D5DB', marginHorizontal: 8 },
  activeOrderBottom: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 16 },
  activeOrderItems: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  activeItemsCount: { fontFamily: FONT.bold, fontSize: 14, color: COLORS.primaryText },
  activeViewItems: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.secondaryText },
  activeOrderDivider: { width: 1, height: 26, backgroundColor: COLORS.border, marginHorizontal: 12 },
  activeOrderTotal: { flex: 1 },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 8,
  },
  trackBtnText: { fontFamily: FONT.semibold, color: COLORS.surface, fontSize: 13, marginRight: 2 },

  // Completed state
  statusBadgeCompleted: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusTextCompleted: { fontFamily: FONT.bold, fontSize: 11, color: COLORS.primaryGreen, marginLeft: 5, letterSpacing: 0.5 },
  completedDate: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.secondaryText, marginBottom: 16 },
  completedProductsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  completedProductImg: { width: 44, height: 44, borderRadius: 8, overflow: 'hidden' },
  completedMoreImg: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#F0F3F1', alignItems: 'center', justifyContent: 'center' },
  completedMoreText: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.secondaryText },
  completedSummaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  completedSummaryText: { fontFamily: FONT.bold, fontSize: 15, color: COLORS.primaryText, marginRight: 12 },
  paidBadge: { backgroundColor: COLORS.softGreen, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  paidBadgeText: { fontFamily: FONT.bold, fontSize: 11, color: COLORS.primaryGreen },
  completedSeparator: { height: 1, backgroundColor: COLORS.border, marginBottom: 16 },
  completedDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  completedDetailBlock: { flex: 1 },
  completedDetailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  completedDetailLabel: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.secondaryText, marginLeft: 6 },
  completedDetailValue: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryText, marginLeft: 19 },
  completedActionsRow: { flexDirection: 'row', gap: 12 },
  viewDetailsBtn: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.primaryGreen },
  viewDetailsText: { fontFamily: FONT.bold, fontSize: 13, color: COLORS.primaryGreen },
  orderAgainBtn: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, backgroundColor: COLORS.primaryGreen },
  orderAgainText: { fontFamily: FONT.bold, fontSize: 13, color: COLORS.surface },

  // Empty state
  emptyCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.softGreen,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  emptyIllustration: { marginRight: 16 },
  emptyTextBlock: { flex: 1 },
  emptyTitle: { fontFamily: FONT.extrabold, fontSize: 18, color: COLORS.primaryText, marginBottom: 8, letterSpacing: -0.2 },
  emptySub: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.secondaryText, lineHeight: 19, marginBottom: 16 },
  startShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  startShoppingText: { fontFamily: FONT.semibold, fontSize: 13.5, color: COLORS.surface },

  // Shared sections
  sectionContainer: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontFamily: FONT.bold, fontSize: 18, color: COLORS.primaryText, letterSpacing: -0.2 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryGreen, marginRight: 2 },
  horizontalScroll: { paddingHorizontal: 16, gap: 16 },

  // Order history cards
  historyCard: { width: 200, backgroundColor: COLORS.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginRight: 16 },
  historyCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  historyStatusText: { flex: 1, fontFamily: FONT.semibold, fontSize: 12, color: COLORS.primaryGreen, marginLeft: 6 },
  historyDate: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.secondaryText, marginBottom: 12 },
  historyImagesRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  historyProductImg: { width: 34, height: 34, borderRadius: 6, overflow: 'hidden' },
  historyMoreImg: { width: 34, height: 34, borderRadius: 6, backgroundColor: '#F0F3F1', alignItems: 'center', justifyContent: 'center' },
  historyMoreText: { fontFamily: FONT.semibold, fontSize: 11, color: COLORS.secondaryText },
  historySummaryText: { fontFamily: FONT.bold, fontSize: 13, color: COLORS.primaryText, marginBottom: 16 },
  historyOrderAgainBtn: { backgroundColor: COLORS.softGreen, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  historyOrderAgainText: { fontFamily: FONT.bold, fontSize: 12, color: COLORS.primaryGreen },
  historyViewDetailsBtn: { backgroundColor: '#F8FAF7', paddingVertical: 9, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  historyViewDetailsText: { fontFamily: FONT.semibold, fontSize: 12, color: COLORS.primaryGreen },

  // Product cards (Buy Again / You might like)
  productCard: { width: 122, marginRight: 16 },
  productImageWrapper: { width: '100%', marginBottom: 8 },
  productName: { fontFamily: FONT.semibold, fontSize: 12, color: COLORS.primaryText, marginBottom: 4, lineHeight: 16 },
  productSize: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.secondaryText, marginBottom: 8 },
  productBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontFamily: FONT.bold, fontSize: 14, color: COLORS.primaryText },
  addBtn: { width: 30, height: 30, borderRadius: 9, backgroundColor: COLORS.softGreen, alignItems: 'center', justifyContent: 'center' },
});

export default OrdersScreen;