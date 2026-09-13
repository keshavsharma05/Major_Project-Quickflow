import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { assets } from '../../assets';
import BottomNavigation from '../../components/BottomNavigation';

/**
 * Same font setup as ProfileScreen — loaded once, high up in the app,
 * via expo-font / useFonts. See ProfileScreen.js for the loader snippet.
 * Falls back gracefully to `System` if you'd rather skip bundling fonts.
 */
const FONT = {
  regular: 'Jakarta-Regular',
  medium: 'Jakarta-Medium',
  semibold: 'Jakarta-SemiBold',
  bold: 'Jakarta-Bold',
  extrabold: 'Jakarta-ExtraBold',
};

const COLORS = {
  background: '#F7FAF8',
  surface: '#FFFFFF',
  primaryGreen: '#15803D',
  primaryGreenSoft: '#16A34A',
  deepGreen: '#0B5D34',
  softGreen: '#E9F6EC',
  iconChipBorder: '#D9EDDE',
  primaryText: '#10221A',
  secondaryText: '#70807A',
  tertiaryText: '#98A39D',
  border: '#EAEFEC',
  divider: '#F0F3F1',
  successGreen: '#16A34A',
  discountRed: '#E11D48',
  shadow: 'rgba(16, 34, 26, 0.06)',
};

// ---------------------------------------------------------------------------
// Placeholder art — swap for real product photography when available.
// Keeping these as styled chips (not flat grey boxes) so the screen still
// feels finished before real images are wired in.
// ---------------------------------------------------------------------------

const ProductArt = ({ size = 60, radius = 12, tint = COLORS.softGreen, children, source }) => {
  if (source) {
    return (
      <Image 
        source={{ uri: source }} 
        style={{ width: size, height: size, borderRadius: radius }} 
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: tint,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
};

// Datasets
const POPULAR_ITEMS = [
  { id: '1', name: 'Milk', icon: 'coffee' },
  { id: '2', name: 'Bread', icon: 'square' },
  { id: '3', name: 'Eggs', icon: 'circle' },
  { id: '4', name: 'Noodles', icon: 'box' },
  { id: '5', name: 'Cucumber', icon: 'feather' },
  { id: '6', name: 'Vegetables', icon: 'feather' },
];

const SEARCH_RESULTS = [
  { id: '1', name: 'Amul Taaza Milk', size: '1 L · Pouch', price: '₹68', oldPrice: '₹76', discount: '10% OFF', time: '8 min' },
  { id: '2', name: 'Britannia Brown Bread', size: '400 g', price: '₹35', oldPrice: '₹40', discount: '12% OFF', time: '8 min' },
  { id: '3', name: 'Banana', size: '1 kg (7-8 pcs)', price: '₹48', oldPrice: null, discount: null, time: '10 min' },
  { id: '4', name: 'Maggi 2-Minute Noodles', size: '70 g', price: '₹20', oldPrice: '₹24', discount: '17% OFF', time: '8 min' },
];

const SearchScreen = ({ onNavigate }) => {
  const { state, addToCart, updateCartQty } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

  const removeRecent = (termToRemove) => {
    setRecentSearches((prev) => prev.filter((term) => term !== termToRemove));
  };

  const clearRecent = () => setRecentSearches([]);
  
  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '') {
      setRecentSearches((prev) => {
        const newSearches = prev.filter(t => t !== searchQuery.trim());
        newSearches.unshift(searchQuery.trim());
        return newSearches.slice(0, 5); // Keep top 5
      });
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
  };

  const filteredResults = searchQuery
    ? state.products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* TOP SEARCH HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('Home')} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color={COLORS.primaryText} />
          </TouchableOpacity>

          <View style={styles.searchInputContainer}>
            <Feather name="search" size={17} color={COLORS.secondaryText} style={{ marginRight: 9 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for anything..."
              placeholderTextColor={COLORS.tertiaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} style={styles.micChip}>
              <Feather name="mic" size={14} color={COLORS.primaryGreen} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.topCartBtn} onPress={() => onNavigate('Cart')} activeOpacity={0.7}>
            <Feather name="shopping-cart" size={19} color={COLORS.primaryText} />
            {cartCount > 0 && (
              <View style={styles.topCartBadge}>
                <Text style={styles.topCartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {searchQuery.length === 0 ? (
            <>
              {/* RECENT SEARCHES */}
              {recentSearches.length > 0 && (
                <View style={styles.recentSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent searches</Text>
                    <TouchableOpacity onPress={clearRecent}>
                      <Text style={styles.clearAllText}>Clear all</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.recentChipsContainer}>
                    {recentSearches.map((term, index) => (
                      <TouchableOpacity key={index} style={styles.recentChip} onPress={() => setSearchQuery(term)} activeOpacity={0.7}>
                        <Feather name="clock" size={12} color={COLORS.secondaryText} style={{ marginRight: 6 }} />
                        <Text style={styles.recentChipText}>{term}</Text>
                        <TouchableOpacity onPress={() => removeRecent(term)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Feather name="x" size={12} color={COLORS.tertiaryText} style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* POPULAR RIGHT NOW */}
              <View style={styles.popularSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Popular right now</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAllText}>View all</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
                  {state.products.slice(0, 5).map((item) => (
                    <TouchableOpacity key={item.id} style={styles.popularCard} onPress={() => setSearchQuery(item.name)} activeOpacity={0.75}>
                      <View style={styles.popularImageWrapper}>
                        <Image source={{ uri: item.image }} style={{ width: 44, height: 44, borderRadius: 10 }} />
                      </View>
                      <Text style={styles.popularCardName} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* CUSTOM ITEM BANNER */}
              <TouchableOpacity style={styles.customBanner} activeOpacity={0.9}>
                <View style={styles.customBannerLeft}>
                  <Text style={styles.customBannerSub}>Can't find what you want?</Text>
                  <Text style={styles.customBannerTitle}>We'll get it for you!</Text>
                  <Text style={styles.customBannerDesc}>Add a custom item and{'\n'}we'll source it for you.</Text>
                  <View style={styles.customBannerCTA}>
                    <Text style={styles.customBannerCTAText}>Add custom item</Text>
                    <Feather name="arrow-right" size={14} color={COLORS.primaryGreen} style={{ marginLeft: 6 }} />
                  </View>
                </View>
                <View style={styles.customBannerRight}>
                  <Ionicons name="sparkles" size={14} color="#7FC98E" style={styles.bannerSparkleA} />
                  <Ionicons name="sparkles" size={10} color="#A6DDAF" style={styles.bannerSparkleB} />
                  <View style={styles.basketWrap}>
                    <Ionicons name="basket" size={52} color={COLORS.deepGreen} />
                    <View style={styles.basketBolt}>
                      <Feather name="zap" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* SEARCH RESULTS HEADER */}
              <View style={[styles.sectionHeader, { marginBottom: 16, alignItems: 'flex-end' }]}>
                <View style={styles.resultsHeaderLeft}>
                  <Text style={styles.sectionTitle}>Search results</Text>
                  <Text style={styles.resultsCount}>{filteredResults.length} items</Text>
                </View>
                <View style={styles.controlsRow}>
                  <TouchableOpacity style={styles.controlPill} activeOpacity={0.7}>
                    <Text style={styles.controlPillText}>Filter</Text>
                    <Feather name="sliders" size={13} color={COLORS.primaryGreen} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlPill} activeOpacity={0.7}>
                    <Text style={styles.controlPillText}>Sort</Text>
                    <Feather name="chevrons-up" size={13} color={COLORS.primaryGreen} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* SEARCH RESULT LIST */}
              <View style={styles.resultsList}>
                {filteredResults.map((item) => {
                  const cartItem = state.cart.find(i => i.productId === item.id);
              const qty = cartItem ? cartItem.qty : 0;
              return (
              <TouchableOpacity key={item.id} style={styles.resultCard} activeOpacity={0.9} onPress={() => onNavigate({ name: 'Product', params: { id: item.id } })}>
                <View style={styles.resultImageContainer}>
                  <ProductArt size={78} radius={14} source={item.image}>
                    <Feather name="shopping-bag" size={24} color={COLORS.primaryGreen} />
                  </ProductArt>
                  <View style={styles.resultTimeBadge}>
                    <Feather name="zap" size={9} color={COLORS.primaryGreen} />
                    <Text style={styles.resultTimeBadgeText}> {item.time}</Text>
                  </View>
                </View>

                <View style={styles.resultInfoContainer}>
                  <Text style={styles.resultName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.resultSize}>{item.size}</Text>

                  <View style={styles.resultPriceRow}>
                    <Text style={styles.resultPrice}>₹{item.price}</Text>
                    {item.oldPrice && <Text style={styles.resultOldPrice}>₹{item.oldPrice}</Text>}
                    {item.discount && <Text style={styles.resultDiscount}>{item.discount}</Text>}
                  </View>
                </View>

                <View style={styles.resultActionContainer}>
                  {qty > 0 ? (
                    <View style={styles.qtyControlSmall}>
                      <TouchableOpacity style={styles.qtyBtnSmall} onPress={() => updateCartQty(item.id, qty - 1)}>
                        <Text style={styles.qtyBtnTextSmall}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyTextSmall}>{qty}</Text>
                      <TouchableOpacity style={styles.qtyBtnSmall} onPress={() => handleAddToCart(item)}>
                        <Text style={styles.qtyBtnTextSmall}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.resultAddBtn} onPress={() => handleAddToCart(item)} activeOpacity={0.8}>
                      <Feather name="plus" size={18} color={COLORS.surface} />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            )})}
          </View>
          </>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      <BottomNavigation activeTab="Search" onNavigate={onNavigate} cartCount={cartCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 130,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 23,
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 14.5,
    color: COLORS.primaryText,
    paddingVertical: 0,
  },
  micChip: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCartBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  topCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primaryGreenSoft,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  topCartBadgeText: { fontFamily: FONT.bold, color: COLORS.surface, fontSize: 10 },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: 17,
    color: COLORS.primaryText,
    letterSpacing: -0.2,
  },

  // Recent searches
  recentSection: { marginBottom: 24 },
  clearAllText: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryGreen },
  recentChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -10,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
    marginBottom: 10,
  },
  recentChipText: { fontFamily: FONT.medium, fontSize: 13, color: COLORS.primaryText },

  // Popular right now
  popularSection: { marginBottom: 26 },
  viewAllText: { fontFamily: FONT.semibold, fontSize: 13, color: COLORS.primaryGreen },
  popularScroll: { paddingRight: 16 },
  popularCard: { alignItems: 'center', marginRight: 16, width: 76 },
  popularImageWrapper: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  popularCardName: { fontFamily: FONT.semibold, fontSize: 12, color: COLORS.primaryText },

  // Custom item banner
  customBanner: {
    backgroundColor: COLORS.softGreen,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    overflow: 'hidden',
  },
  customBannerLeft: { flex: 1 },
  customBannerSub: { fontFamily: FONT.medium, fontSize: 12, color: COLORS.secondaryText, marginBottom: 4 },
  customBannerTitle: { fontFamily: FONT.extrabold, fontSize: 20, color: COLORS.primaryText, marginBottom: 6, letterSpacing: -0.3 },
  customBannerDesc: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.secondaryText, marginBottom: 13, lineHeight: 18 },
  customBannerCTA: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  customBannerCTAText: { fontFamily: FONT.bold, fontSize: 14, color: COLORS.primaryGreen },
  customBannerRight: { marginLeft: 12, width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  basketWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  basketBolt: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primaryGreenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.softGreen,
  },
  bannerSparkleA: { position: 'absolute', top: 2, left: -6, zIndex: 1 },
  bannerSparkleB: { position: 'absolute', bottom: 14, left: 4, zIndex: 1 },

  // Search results header
  resultsHeaderLeft: { flexDirection: 'row', alignItems: 'baseline' },
  resultsCount: { fontFamily: FONT.medium, fontSize: 12, color: COLORS.secondaryText, marginLeft: 8 },
  controlsRow: { flexDirection: 'row' },
  controlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginLeft: 8,
  },
  controlPillText: { fontFamily: FONT.semibold, fontSize: 12, color: COLORS.primaryText },

  // Result list
  resultsList: { gap: 12 },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
    alignItems: 'center',
  },
  resultImageContainer: { position: 'relative', marginRight: 14 },
  resultTimeBadge: {
    position: 'absolute',
    bottom: -8,
    left: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultTimeBadgeText: { fontFamily: FONT.bold, fontSize: 9.5, color: COLORS.primaryGreen },
  resultInfoContainer: { flex: 1, justifyContent: 'center' },
  resultName: { fontFamily: FONT.semibold, fontSize: 14, color: COLORS.primaryText, marginBottom: 4, lineHeight: 18 },
  resultSize: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.secondaryText, marginBottom: 10 },
  resultPriceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  resultPrice: { fontFamily: FONT.bold, fontSize: 15.5, color: COLORS.primaryText, marginRight: 8 },
  resultOldPrice: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: COLORS.tertiaryText,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  resultDiscount: { fontFamily: FONT.bold, fontSize: 11, color: COLORS.successGreen },
  resultActionContainer: { justifyContent: 'center', alignItems: 'center', paddingLeft: 8 },
  resultAddBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primaryGreenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryGreenSoft,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  qtyControlSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 12,
    height: 38,
    width: 80,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    shadowColor: COLORS.primaryGreenSoft,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  qtyBtnSmall: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnTextSmall: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyTextSmall: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SearchScreen;