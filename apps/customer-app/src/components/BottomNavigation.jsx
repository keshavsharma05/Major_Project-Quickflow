import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, Animated } from 'react-native';
import Svg, { Path, Defs, Filter, FeDropShadow } from 'react-native-svg';

const COLORS = {
  surface: '#FFFFFF',
  primaryGreen: '#16A34A',
  secondaryText: '#6B756E',
  glassBorder: 'rgba(255, 255, 255, 0.65)',
  glassBackground: 'rgba(255, 255, 255, 0.85)',
};

const { width } = Dimensions.get('window');
const DOCK_WIDTH = width - 40;
const DOCK_HEIGHT = 70;
const cx = DOCK_WIDTH / 2;

// The sculpted dock background path
const dockPath = `
  M 35 0
  L ${cx - 48} 0
  C ${cx - 24} 0, ${cx - 38} 44, ${cx} 44
  C ${cx + 38} 44, ${cx + 24} 0, ${cx + 48} 0
  L ${DOCK_WIDTH - 35} 0
  A 35 35 0 0 1 ${DOCK_WIDTH} 35
  A 35 35 0 0 1 ${DOCK_WIDTH - 35} 70
  L 35 70
  A 35 35 0 0 1 0 35
  A 35 35 0 0 1 35 0
  Z
`;

// Exact SVG: Home
const IconHome = ({ active }) => (
  <Svg width="24" height="24" viewBox="0 0 256 256" fill={active ? COLORS.primaryGreen : COLORS.secondaryText}>
    <Path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11-79.91,75.45A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
  </Svg>
);

// Exact SVG: Search
const IconSearchNav = ({ active }) => (
  <Svg width="24" height="24" viewBox="0 0 256 256" fill={active ? COLORS.primaryGreen : COLORS.secondaryText}>
    <Path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
  </Svg>
);

// Exact SVG: Cart
const IconCartSolid = () => (
  <Svg width="26" height="26" viewBox="0 0 256 256" fill={COLORS.surface}>
    <Path d="M104,216a16,16,0,1,1-16-16A16,16,0,0,1,104,216Zm88-16a16,16,0,1,0,16,16A16,16,0,0,0,192,200ZM239.71,74.14l-25.64,92.28A24.06,24.06,0,0,1,191,184H92.16A24.06,24.06,0,0,1,69,166.42L33.92,40H16a8,8,0,0,1,0-16H40a8,8,0,0,1,7.71,5.86L57.19,64H232a8,8,0,0,1,7.71,10.14ZM221.47,80H61.64l22.81,82.14A8,8,0,0,0,92.16,168H191a8,8,0,0,0,7.71-5.86Z" />
  </Svg>
);

// Exact SVG: Orders
const IconOrders = ({ active }) => (
  <Svg width="24" height="24" viewBox="0 0 256 256" fill={active ? COLORS.primaryGreen : COLORS.secondaryText}>
    <Path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z" />
  </Svg>
);

// Exact SVG: Profile
const IconProfile = ({ active }) => (
  <Svg width="24" height="24" viewBox="0 0 256 256" fill={active ? COLORS.primaryGreen : COLORS.secondaryText}>
    <Path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
  </Svg>
);

const BottomNavigation = ({ activeTab, onNavigate, cartCount = 3 }) => {
  return (
    <View style={styles.safeAreaBlocker}>
      <View style={styles.dockContainer}>
        
        {/* Sculpted SVG Background */}
        <View style={styles.svgBackgroundWrapper}>
          <Svg width={DOCK_WIDTH} height={DOCK_HEIGHT + 20} style={{ position: 'absolute', top: 0 }}>
            <Defs>
              <Filter id="shadow">
                <FeDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000000" floodOpacity="0.08" />
              </Filter>
            </Defs>
            <Path 
              d={dockPath} 
              fill={COLORS.glassBackground} 
              stroke={COLORS.glassBorder} 
              strokeWidth="1" 
              filter="url(#shadow)" 
            />
          </Svg>
        </View>
        
        <View style={styles.glassDock}>
          {/* Home */}
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Home')} activeOpacity={0.7}>
            <IconHome active={activeTab === 'Home'} />
            <Text style={[styles.navLabel, activeTab === 'Home' && styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>

          {/* Search */}
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Search')} activeOpacity={0.7}>
            <IconSearchNav active={activeTab === 'Search'} />
            <Text style={[styles.navLabel, activeTab === 'Search' && styles.navLabelActive]}>Search</Text>
          </TouchableOpacity>

          {/* CART (Center Embedded) */}
          <View style={styles.cartSpacer}>
            <TouchableOpacity style={styles.cartNavBtn} onPress={() => onNavigate('Cart')} activeOpacity={0.8}>
              <IconCartSolid />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Orders */}
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Orders')} activeOpacity={0.7}>
            <IconOrders active={activeTab === 'Orders'} />
            <Text style={[styles.navLabel, activeTab === 'Orders' && styles.navLabelActive]}>Orders</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Profile')} activeOpacity={0.7}>
            <IconProfile active={activeTab === 'Profile'} />
            <Text style={[styles.navLabel, activeTab === 'Profile' && styles.navLabelActive]}>Profile</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaBlocker: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 104 : 96,
    backgroundColor: '#F8FAF7', 
    zIndex: 9999,
  },
  dockContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: DOCK_WIDTH,
    height: DOCK_HEIGHT,
    zIndex: 9999,
  },
  svgBackgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
  },
  glassDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: DOCK_HEIGHT,
    paddingHorizontal: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  navLabel: {
    fontFamily: 'Outfit-Medium',
    fontSize: 10,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  navLabelActive: {
    fontFamily: 'Outfit-Bold',
    color: COLORS.primaryGreen,
  },
  cartSpacer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  cartNavBtn: {
    position: 'absolute',
    top: -24, 
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 4,
    backgroundColor: COLORS.surface,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cartBadgeText: {
    fontFamily: 'Outfit-Bold',
    color: COLORS.primaryGreen,
    fontSize: 10,
  }
});

export default BottomNavigation;
