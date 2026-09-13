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
import { Feather, Ionicons } from '@expo/vector-icons';
import { assets } from '../../assets';

/**
 * Same "Outfit" family used across Home / Orders / Search / Profile.
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

import { Image } from 'react-native';

// Reserved slot for product photography — plain placeholder, sized per spot.
const ImagePlaceholder = ({ width, height, borderRadius = 0, style, source }) => (
  <View style={[{ width, height, borderRadius, backgroundColor: '#E5EAE6', overflow: 'hidden' }, style]}>
    {source && <Image source={{ uri: source }} style={{ width: '100%', height: '100%' }} />}
  </View>
);

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const INITIAL_ITEMS = [
  { id: '1', name: 'Amul Taaza Milk', size: '1 L · Pouch', price: 68, qty: 1, image: assets?.cart?.milk },
  { id: '2', name: 'Britannia Brown Bread', size: '400 g', price: 35, qty: 1, image: assets?.cart?.bread },
  { id: '3', name: 'Banana', size: '1 kg (7-8 pcs)', price: 48, qty: 1, image: assets?.cart?.banana },
];

const PAYMENT_METHODS = [
  { id: 'upi', title: 'UPI', subtitle: 'Pay using any UPI app', brands: ['GPay', 'PhonePe', 'Paytm'] },
  { id: 'card', title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, Rupay & more', brands: ['VISA', 'MC', 'RuPay'] },
  { id: 'netbanking', title: 'Net Banking', subtitle: 'All major banks supported', icon: 'account-balance' },
  { id: 'wallet', title: 'Wallets', subtitle: 'Paytm, Amazon Pay, Mobikwik & more', icon: 'wallet' },
];

const STEPS = [
  { id: 'address', label: 'Address', icon: 'location' },
  { id: 'payment', label: 'Payment', icon: 'card' },
  { id: 'review', label: 'Review', icon: 'review' },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

const StepIndicator = ({ currentStep = 'address' }) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  return (
    <View style={styles.stepRow}>
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        const isFilled = isDone || isActive;
        return (
          <React.Fragment key={step.id}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, isFilled ? styles.stepCircleActive : styles.stepCircleInactive]}>
                {step.icon === 'location' && (
                  <Ionicons name="location" size={15} color={isFilled ? COLORS.surface : COLORS.tertiaryText} />
                )}
                {step.icon === 'card' && (
                  <Feather name="credit-card" size={14} color={isFilled ? COLORS.surface : COLORS.tertiaryText} />
                )}
                {step.icon === 'review' && (
                  <Feather name="clipboard" size={14} color={isFilled ? COLORS.surface : COLORS.tertiaryText} />
                )}
              </View>
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{step.label}</Text>
            </View>
            {index < STEPS.length - 1 && <View style={styles.stepConnector} />}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const QtyStepper = ({ qty, onIncrease, onDecrease }) => (
  <View style={styles.qtyStepper}>
    <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease} activeOpacity={0.7}>
      <Feather name="minus" size={14} color={COLORS.primaryGreen} />
    </TouchableOpacity>
    <Text style={styles.qtyValue}>{qty}</Text>
    <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease} activeOpacity={0.7}>
      <Feather name="plus" size={14} color={COLORS.primaryGreen} />
    </TouchableOpacity>
  </View>
);

const BrandChip = ({ label }) => (
  <View style={styles.brandChip}>
    <Text style={styles.brandChipText}>{label}</Text>
  </View>
);

const PaymentRow = ({ method, selected, onSelect }) => (
  <TouchableOpacity
    style={[styles.paymentRow, selected && styles.paymentRowSelected]}
    onPress={() => onSelect(method.id)}
    activeOpacity={0.8}
  >
    <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
      {selected && <View style={styles.radioInner} />}
    </View>

    <View style={styles.paymentTextBlock}>
      <Text style={styles.paymentTitle}>{method.title}</Text>
      <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
    </View>

    <View style={styles.paymentRight}>
      {method.brands && method.brands.map((b) => <BrandChip key={b} label={b} />)}
      {method.icon === 'account-balance' && <Feather name="home" size={17} color={COLORS.tertiaryText} style={{ marginRight: 6 }} />}
      {method.icon === 'wallet' && <Feather name="briefcase" size={17} color={COLORS.tertiaryText} style={{ marginRight: 6 }} />}
      <Feather name="chevron-right" size={16} color={COLORS.primaryGreen} />
    </View>
  </TouchableOpacity>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

import { useStore } from '../../store/StoreContext';

const CheckoutScreen = ({ onNavigate }) => {
  const { state, updateCartQty, createOrder } = useStore();
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [priceDetailsOpen, setPriceDetailsOpen] = useState(true);

  // Map global cart state to product details
  const items = state.cart.map(cartItem => {
    const product = state.products.find(p => p.id === cartItem.productId);
    return { ...product, qty: cartItem.qty };
  });

  const updateQty = (id, delta) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateCartQty(id, Math.max(1, item.qty + delta));
    }
  };

  const itemTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = 25;
  const packagingFee = 10;
  const savings = deliveryFee + packagingFee - 0; // both waived
  const toPay = itemTotal;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Cart')} activeOpacity={0.7}>
              <Feather name="arrow-left" size={20} color={COLORS.primaryText} />
            </TouchableOpacity>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Checkout</Text>
              <View style={styles.secureRow}>
                <Feather name="lock" size={12} color={COLORS.primaryGreen} />
                <Text style={styles.secureText}>100% Secure</Text>
              </View>
            </View>
          </View>

          {/* STEP INDICATOR */}
          <StepIndicator currentStep="address" />

          {/* ADDRESS CARD */}
          <TouchableOpacity style={styles.addressCard} activeOpacity={0.85}>
            <View style={styles.addressIconWrapper}>
              <Feather name="home" size={18} color={COLORS.primaryGreen} />
            </View>
            <View style={styles.addressTextBlock}>
              <Text style={styles.deliveringToLabel}>Delivering to</Text>
              <Text style={styles.addressName}>Home</Text>
              <Text style={styles.addressLine}>15, Park View Apartment, Vaishali Nagar,{'\n'}Jaipur, Rajasthan 302021</Text>
              <Text style={styles.changeAddressLink}>Change address</Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.tertiaryText} />
          </TouchableOpacity>

          {/* ESTIMATED DELIVERY BANNER */}
          <View style={styles.etaBanner}>
            <View style={styles.etaLeft}>
              <Feather name="clock" size={16} color={COLORS.primaryGreen} />
              <Text style={styles.etaText}>
                Estimated delivery: <Text style={styles.etaHighlight}>8–12 min</Text>
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.etaChangeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* ORDER ITEMS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Order Items <Text style={styles.sectionCount}>({items.length})</Text>
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.editCartLink}>Edit Cart</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemsCard}>
            {items.map((item, index) => (
              <View key={item.id} style={[styles.itemRow, index === items.length - 1 && { borderBottomWidth: 0 }]}>
                <ImagePlaceholder width={64} height={64} borderRadius={10} source={item.image} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemSize}>{item.size}</Text>
                </View>
                <View style={styles.itemRightCol}>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                  <QtyStepper
                    qty={item.qty}
                    onIncrease={() => updateQty(item.id, 1)}
                    onDecrease={() => updateQty(item.id, -1)}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* PAYMENT METHOD */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentList}>
            {PAYMENT_METHODS.map((method) => (
              <PaymentRow
                key={method.id}
                method={method}
                selected={selectedPayment === method.id}
                onSelect={setSelectedPayment}
              />
            ))}
          </View>

          {/* PRICE DETAILS */}
          <View style={styles.priceCard}>
            <View style={styles.priceGrid}>
              <View style={styles.priceLeftCol}>
                <TouchableOpacity
                  style={styles.priceDetailsHeader}
                  onPress={() => setPriceDetailsOpen((v) => !v)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.priceDetailsTitle}>Price Details</Text>
                  <Feather name={priceDetailsOpen ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.primaryGreen} />
                </TouchableOpacity>

                {priceDetailsOpen && (
                  <>
                    <View style={styles.priceLine}>
                      <Text style={styles.priceLabel}>Item Total ({items.length} items)</Text>
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
                    <View style={styles.priceDivider} />
                  </>
                )}

                <View style={styles.priceLine}>
                  <Text style={styles.toPayLabel}>To Pay</Text>
                  <Text style={styles.toPayValue}>₹{toPay}</Text>
                </View>
              </View>

              <View style={styles.priceRightCol}>
                <View style={styles.savingsBanner}>
                  <Ionicons name="shield-checkmark" size={16} color={COLORS.primaryGreen} />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={styles.savingsTitle}>You are saving ₹{savings}</Text>
                    <Text style={styles.savingsSub}>Yay! FREE delivery unlocked</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.proceedBtn} activeOpacity={0.85} onPress={() => {
                  if (onNavigate) {
                    createOrder(toPay);
                    onNavigate('OrderConfirmation');
                  }
                }}>
                  <Feather name="lock" size={15} color={COLORS.surface} />
                  <Text style={styles.proceedBtnText}>Proceed to Payment</Text>
                </TouchableOpacity>

                <View style={styles.safeRow}>
                  <Feather name="shield" size={11} color={COLORS.secondaryText} />
                  <Text style={styles.safeText}>Safe & Secure Payments</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTextBlock: { justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.extrabold, fontSize: 28, color: COLORS.primaryText, letterSpacing: -0.5, marginBottom: 4 },
  secureRow: { flexDirection: 'row', alignItems: 'center' },
  secureText: { fontFamily: FONT.medium, fontSize: 13, color: COLORS.primaryGreen, marginLeft: 5 },

  // Step indicator
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stepItem: { alignItems: 'center', width: 64 },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
  },
  stepCircleActive: { backgroundColor: COLORS.primaryGreen, borderColor: COLORS.primaryGreen },
  stepCircleInactive: { backgroundColor: COLORS.surface, borderColor: COLORS.border },
  stepLabel: { fontFamily: FONT.medium, fontSize: 12, color: COLORS.tertiaryText },
  stepLabelActive: { fontFamily: FONT.semibold, color: COLORS.primaryText },
  stepConnector: { flex: 1, height: 1, backgroundColor: COLORS.border, marginTop: 17, marginHorizontal: -8 },

  // Address card
  addressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomWidth: 0,
    alignItems: 'flex-start',
  },
  addressIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  addressTextBlock: { flex: 1 },
  deliveringToLabel: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.secondaryText, marginBottom: 2 },
  addressName: { fontFamily: FONT.bold, fontSize: 17, color: COLORS.primaryText, marginBottom: 4 },
  addressLine: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.secondaryText, lineHeight: 19, marginBottom: 8 },
  changeAddressLink: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryGreen },

  // ETA banner
  etaBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.softGreen,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 28,
  },
  etaLeft: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  etaText: { fontFamily: FONT.regular, fontSize: 13.5, color: COLORS.primaryText, marginLeft: 8 },
  etaHighlight: { fontFamily: FONT.bold, color: COLORS.primaryGreen },
  etaChangeLink: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryGreen },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: { fontFamily: FONT.bold, fontSize: 17, color: COLORS.primaryText, letterSpacing: -0.2 },
  sectionCount: { fontFamily: FONT.regular, color: COLORS.secondaryText },
  editCartLink: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryGreen },

  // Order items
  itemsCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    marginBottom: 28,
    overflow: 'hidden',
  },
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
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softGreen,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  qtyBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontFamily: FONT.bold, fontSize: 13.5, color: COLORS.primaryText, minWidth: 18, textAlign: 'center' },

  // Payment method
  paymentList: { marginHorizontal: 16, marginBottom: 28, gap: 10 },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 14,
  },
  paymentRowSelected: { backgroundColor: COLORS.softGreen, borderColor: COLORS.primaryGreen },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioOuterActive: { borderColor: COLORS.primaryGreen },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primaryGreen },
  paymentTextBlock: { flex: 1 },
  paymentTitle: { fontFamily: FONT.semibold, fontSize: 14.5, color: COLORS.primaryText, marginBottom: 2 },
  paymentSubtitle: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.secondaryText },
  paymentRight: { flexDirection: 'row', alignItems: 'center' },
  brandChip: {
    backgroundColor: '#F1F4F2',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  brandChipText: { fontFamily: FONT.semibold, fontSize: 9.5, color: COLORS.secondaryText },

  // Price details
  priceCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  priceGrid: { flexDirection: 'row' },
  priceLeftCol: { flex: 1.1, paddingRight: 14 },
  priceRightCol: { flex: 1, justifyContent: 'flex-start' },
  priceDetailsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  priceDetailsTitle: { fontFamily: FONT.bold, fontSize: 14.5, color: COLORS.primaryGreen, marginRight: 6 },
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
  priceDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: 10 },
  toPayLabel: { fontFamily: FONT.bold, fontSize: 15, color: COLORS.primaryText },
  toPayValue: { fontFamily: FONT.extrabold, fontSize: 17, color: COLORS.primaryGreen, letterSpacing: -0.3 },

  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.softGreen,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  savingsTitle: { fontFamily: FONT.bold, fontSize: 12.5, color: COLORS.primaryText, marginBottom: 2 },
  savingsSub: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.secondaryText, lineHeight: 15 },

  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryGreen,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  proceedBtnText: { fontFamily: FONT.bold, fontSize: 14, color: COLORS.surface, marginLeft: 8 },
  safeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  safeText: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.secondaryText, marginLeft: 5 },
});

export default CheckoutScreen;