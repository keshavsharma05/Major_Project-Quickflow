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
 * Same "Outfit" family used across Home / Orders / Search / Profile / Checkout.
 * See HomeScreen.js for the expo-font loader snippet.
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
  shadow: 'rgba(17, 24, 20, 0.05)',
};

// Reserved slot for product / illustration photography.
const ImagePlaceholder = ({ width, height, borderRadius = 0, style, source }) => (
  <View style={[{ width, height, borderRadius, backgroundColor: '#E5EAE6', overflow: 'hidden' }, style]}>
    {source && <Image source={{ uri: source }} style={{ width: '100%', height: '100%' }} />}
  </View>
);

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const ORDER_ITEMS = [
  { id: '1', name: 'Amul Taaza Milk', size: '1 L · Pouch', price: 68, qty: 1, image: assets?.cart?.milk },
  { id: '2', name: 'Britannia Brown Bread', size: '400 g', price: 35, qty: 1, image: assets?.cart?.bread },
  { id: '3', name: 'Banana', size: '1 kg (7-8 pcs)', price: 48, qty: 1, image: assets?.cart?.banana },
];

// Confetti sprinkles around the success badge — small rotated squares / dots
// positioned around the checkmark, echoing the reference without icons.
const CONFETTI = [
  { top: 8, left: 30, size: 8, color: '#7DD3C0', rotate: '20deg', shape: 'diamond' },
  { top: 2, left: 62, size: 6, color: '#F0B429', rotate: '0deg', shape: 'dot' },
  { top: 34, left: 88, size: 7, color: '#60A5FA', rotate: '15deg', shape: 'diamond' },
  { top: 62, left: 4, size: 7, color: '#5EC9C4', rotate: '10deg', shape: 'diamond' },
  { top: 30, left: 6, size: 6, color: '#F4A6C6', rotate: '0deg', shape: 'dot' },
  { top: 78, left: 78, size: 6, color: '#F4A6C6', rotate: '0deg', shape: 'dot' },
  { top: 6, left: 12, size: 5, color: '#A3E635', rotate: '0deg', shape: 'dot' },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

const ConfettiField = () => (
  <View style={styles.confettiField} pointerEvents="none">
    {CONFETTI.map((c, i) => (
      <View
        key={i}
        style={[
          c.shape === 'diamond' ? styles.confettiDiamond : styles.confettiDot,
          {
            top: `${c.top}%`,
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            transform: [{ rotate: c.rotate }],
          },
        ]}
      />
    ))}
  </View>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

import { useStore } from '../../store/StoreContext';
import { Image } from 'react-native';

const OrderConfirmationScreen = ({ onNavigate }) => {
  const { state } = useStore();
  const [cartCount] = useState(state.cart.length); // Typically 0

  const activeOrder = state.activeOrder;
  const orderItems = activeOrder ? activeOrder.items.map(cartItem => {
    const product = state.products.find(p => p.id === cartItem.productId);
    return { ...product, qty: cartItem.qty };
  }) : ORDER_ITEMS;

  const itemTotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = activeOrder ? 0 : 25; // Dummy logic
  const packagingFee = 10;
  const toPay = activeOrder ? activeOrder.totalAmount : itemTotal;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.roundBtn} onPress={() => onNavigate && onNavigate('Home')} activeOpacity={0.7}>
              <Feather name="arrow-left" size={20} color={COLORS.primaryText} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundBtn} activeOpacity={0.7}>
              <Feather name="headphones" size={19} color={COLORS.primaryText} />
            </TouchableOpacity>
          </View>

          {/* SUCCESS HERO */}
          <View style={styles.heroSection}>
            <ConfettiField />
            <View style={styles.successRing}>
              <View style={styles.successCircle}>
                <Feather name="check" size={40} color={COLORS.surface} />
              </View>
            </View>
            <Text style={styles.heroTitle}>Order Confirmed!</Text>
            <Text style={styles.heroSub}>Yay! Your order has been placed successfully.</Text>
          </View>

          {/* ARRIVING IN CARD */}
          <TouchableOpacity style={styles.arrivingCard} activeOpacity={0.8} onPress={() => onNavigate && onNavigate('LiveOrderTracking')}>
            <View style={styles.arrivingLeft}>
              <View style={styles.arrivingIconWrapper}>
                <MaterialCommunityIcons name="moped" size={20} color={COLORS.primaryGreen} />
              </View>
              <View>
                <Text style={styles.arrivingLabel}>Arriving in</Text>
                <Text style={styles.arrivingValue}>8–12 min</Text>
              </View>
            </View>
            <View style={styles.arrivingDivider} />
            <Text style={styles.arrivingNote}>We'll start preparing{'\n'}your order shortly.</Text>
          </TouchableOpacity>

          {/* ORDER ID */}
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdText}>Order ID: QF58931245</Text>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
              <Feather name="copy" size={14} color={COLORS.secondaryText} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

          {/* SAVINGS + QUICKPOINTS BANNER */}
          <TouchableOpacity style={styles.savingsBanner} activeOpacity={0.85}>
            <View style={styles.savingsIconWrapper}>
              <Feather name="star" size={17} color={COLORS.primaryGreen} />
            </View>
            <View style={styles.savingsTextBlock}>
              <Text style={styles.savingsTitle}>
                You saved <Text style={{ color: COLORS.primaryGreen }}>₹36</Text> on this order!
              </Text>
              <View style={styles.quickPointsRow}>
                <Text style={styles.savingsSub}>You'll earn </Text>
                <Ionicons name="disc" size={12} color={COLORS.primaryGreen} />
                <Text style={styles.savingsSub}> 15 QuickPoints after delivery</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.tertiaryText} />
          </TouchableOpacity>

          {/* ORDER DETAILS */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsCardHeader}>
              <Text style={styles.cardTitle}>Order Details</Text>
              <View style={styles.itemsCountPill}>
                <Text style={styles.itemsCountText}>{orderItems.length} items</Text>
              </View>
            </View>

            {orderItems.map((item, index) => (
              <View key={item.id} style={[styles.itemRow, index === orderItems.length - 1 && { borderBottomWidth: 0 }]}>
                <ImagePlaceholder width={64} height={64} borderRadius={10} source={item.image} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemSize}>{item.size}</Text>
                </View>
                <View style={styles.itemRightCol}>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                  <View style={styles.qtyPill}>
                    <Text style={styles.qtyPillText}>Qty: {item.qty}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* DELIVERY + PAYMENT INFO */}
          <View style={styles.infoCard}>
            <View style={styles.infoBlock}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="location" size={15} color={COLORS.primaryGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Delivering to</Text>
                <Text style={styles.infoValue}>Home</Text>
                <Text style={styles.infoSub}>15, Park View Apartment,{'\n'}Vaishali Nagar, Jaipur,{'\n'}Rajasthan 302021</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoBlock}>
              <View style={styles.infoIconWrapper}>
                <Feather name="credit-card" size={14} color={COLORS.primaryGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Payment Method</Text>
                <Text style={styles.infoValue}>UPI</Text>
                <Text style={styles.infoSub}>Paid ₹{toPay}</Text>
              </View>
            </View>
          </View>

          {/* ORDER SUMMARY */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.cardTitle}>Order Summary</Text>
              <TouchableOpacity style={styles.viewDetailsRow} activeOpacity={0.7}>
                <Text style={styles.viewDetailsLink}>View details</Text>
                <Feather name="chevron-down" size={14} color={COLORS.primaryGreen} />
              </TouchableOpacity>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryLeftCol}>
                <View style={styles.priceLine}>
                  <Text style={styles.priceLabel}>Item Total ({orderItems.length} items)</Text>
                  <Text style={styles.priceValue}>₹{itemTotal}</Text>
                </View>
                <View style={styles.priceLine}>
                  <Text style={styles.priceLabel}>Delivery Fee</Text>
                  <View style={styles.priceFreeRow}>
                    <Text style={styles.priceStrike}>₹{deliveryFee}</Text>
                    <Text style={styles.priceFree}>FREE</Text>
                  </View>
                </View>
                <View style={styles.priceLine}>
                  <Text style={styles.priceLabel}>Packaging Fee</Text>
                  <View style={styles.priceFreeRow}>
                    <Text style={styles.priceStrike}>₹{packagingFee}</Text>
                    <Text style={styles.priceFree}>FREE</Text>
                  </View>
                </View>
                <View style={styles.dashedDivider} />
                <View style={styles.priceLine}>
                  <Text style={styles.toPayLabel}>To Pay</Text>
                  <Text style={styles.toPayValue}>₹{toPay}</Text>
                </View>
              </View>

              <View style={styles.summaryRightCol}>
                {/* Reserved slot for the delivery-bag illustration */}
                <ImagePlaceholder width={110} height={110} borderRadius={16} style={{ backgroundColor: COLORS.softGreen }} />
                <TouchableOpacity style={styles.shareRow} activeOpacity={0.7}>
                  <Feather name="share-2" size={12} color={COLORS.primaryGreen} />
                  <Text style={styles.shareText}>Share this with friends</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* NEXT ORDER PROMO */}
          <View style={styles.promoBanner}>
            <View style={styles.promoLeft}>
              <View style={styles.promoIconWrapper}>
                <Ionicons name="pricetag" size={16} color={COLORS.primaryGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.promoTitle}>
                  Get flat <Text style={{ color: COLORS.primaryGreen }}>₹75 OFF</Text> on your next order
                </Text>
                <Text style={styles.promoSub}>Valid on orders above ₹299</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.orderAgainBtn} activeOpacity={0.85}>
              <Text style={styles.orderAgainText}>Order Again</Text>
            </TouchableOpacity>
          </View>

          {/* TRACK ORDER BUTTON */}
          <View style={styles.trackOrderBtnContainer}>
            <TouchableOpacity style={styles.majorTrackBtn} activeOpacity={0.85} onPress={() => onNavigate && onNavigate('LiveOrderTracking')}>
              <Text style={styles.majorTrackBtnText}>Track Your Order</Text>
              <Feather name="arrow-right" size={18} color={COLORS.surface} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 4,
  },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Hero
  heroSection: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, marginBottom: 24, position: 'relative' },
  confettiField: { position: 'absolute', top: -10, left: 0, right: 0, height: 200 },
  confettiDot: { position: 'absolute', borderRadius: 20 },
  confettiDiamond: { position: 'absolute', borderRadius: 2 },
  successRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(22,163,74,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontFamily: FONT.extrabold, fontSize: 26, color: COLORS.primaryText, marginBottom: 8, letterSpacing: -0.3 },
  heroSub: { fontFamily: FONT.regular, fontSize: 14, color: COLORS.secondaryText, textAlign: 'center' },

  // Arriving card
  arrivingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
  },
  arrivingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  arrivingIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  arrivingLabel: { fontFamily: FONT.medium, fontSize: 12, color: COLORS.primaryGreen, marginBottom: 1 },
  arrivingValue: { fontFamily: FONT.extrabold, fontSize: 19, color: COLORS.primaryText, letterSpacing: -0.3 },
  arrivingDivider: { width: 1, height: 34, backgroundColor: COLORS.border, marginHorizontal: 14 },
  arrivingNote: { flex: 1, fontFamily: FONT.regular, fontSize: 12.5, color: COLORS.secondaryText, lineHeight: 17 },

  // Order id
  orderIdRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  orderIdText: { fontFamily: FONT.medium, fontSize: 13, color: COLORS.secondaryText },

  // Savings banner
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softGreen,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  savingsIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  savingsTextBlock: { flex: 1 },
  savingsTitle: { fontFamily: FONT.bold, fontSize: 13.5, color: COLORS.primaryText, marginBottom: 3 },
  quickPointsRow: { flexDirection: 'row', alignItems: 'center' },
  savingsSub: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.secondaryText },

  // Shared card title
  cardTitle: { fontFamily: FONT.bold, fontSize: 16, color: COLORS.primaryText, letterSpacing: -0.2 },

  // Order details card
  detailsCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  detailsCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemsCountPill: { backgroundColor: COLORS.softGreen, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  itemsCountText: { fontFamily: FONT.semibold, fontSize: 11.5, color: COLORS.primaryGreen },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemInfo: { flex: 1, marginLeft: 14, marginRight: 8 },
  itemName: { fontFamily: FONT.semibold, fontSize: 14.5, color: COLORS.primaryText, marginBottom: 4 },
  itemSize: { fontFamily: FONT.regular, fontSize: 12.5, color: COLORS.secondaryText },
  itemRightCol: { alignItems: 'flex-end' },
  itemPrice: { fontFamily: FONT.bold, fontSize: 15, color: COLORS.primaryText, marginBottom: 8 },
  qtyPill: { backgroundColor: COLORS.softGreen, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  qtyPillText: { fontFamily: FONT.semibold, fontSize: 11, color: COLORS.primaryGreen },

  // Delivery + payment info card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  infoBlock: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  infoIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 12 },
  infoLabel: { fontFamily: FONT.regular, fontSize: 11.5, color: COLORS.secondaryText, marginBottom: 2 },
  infoValue: { fontFamily: FONT.bold, fontSize: 14, color: COLORS.primaryText, marginBottom: 4 },
  infoSub: { fontFamily: FONT.regular, fontSize: 11.5, color: COLORS.secondaryText, lineHeight: 16 },

  // Order summary card
  summaryCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 20,
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewDetailsRow: { flexDirection: 'row', alignItems: 'center' },
  viewDetailsLink: { fontFamily: FONT.semibold, fontSize: 12.5, color: COLORS.primaryGreen, marginRight: 3 },
  summaryGrid: { flexDirection: 'row' },
  summaryLeftCol: { flex: 1.2, paddingRight: 14 },
  summaryRightCol: { flex: 1, alignItems: 'center' },
  priceLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  priceLabel: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.secondaryText, flexShrink: 1 },
  priceValue: { fontFamily: FONT.semibold, fontSize: 13.5, color: COLORS.primaryText },
  priceFreeRow: { flexDirection: 'row', alignItems: 'center' },
  priceStrike: {
    fontFamily: FONT.regular,
    fontSize: 12.5,
    color: COLORS.tertiaryText,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  priceFree: { fontFamily: FONT.bold, fontSize: 12.5, color: COLORS.primaryGreen },
  dashedDivider: { height: 1, borderStyle: 'dashed', borderWidth: 0.6, borderColor: COLORS.border, marginBottom: 10 },
  toPayLabel: { fontFamily: FONT.bold, fontSize: 15, color: COLORS.primaryText },
  toPayValue: { fontFamily: FONT.extrabold, fontSize: 17, color: COLORS.primaryGreen, letterSpacing: -0.3 },
  shareRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  shareText: { fontFamily: FONT.semibold, fontSize: 11.5, color: COLORS.primaryGreen, marginLeft: 5 },

  // Next order promo
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softGreen,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
  },
  promoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  promoIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  promoTitle: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryText, marginBottom: 2 },
  promoSub: { fontFamily: FONT.regular, fontSize: 11.5, color: COLORS.secondaryText },
  orderAgainBtn: { backgroundColor: COLORS.primaryGreen, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12 },
  orderAgainText: { fontFamily: FONT.bold, fontSize: 13, color: COLORS.surface },

  trackOrderBtnContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  majorTrackBtn: {
    backgroundColor: COLORS.primaryText,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  majorTrackBtnText: {
    fontFamily: FONT.bold,
    fontSize: 16,
    color: COLORS.surface,
  },
});

export default OrderConfirmationScreen;