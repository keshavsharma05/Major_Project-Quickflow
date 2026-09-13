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
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

const FONT = {
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semibold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
  extrabold: 'Outfit-Bold',
};

const COLORS = {
  background: '#F7FAF8',
  surface: '#FFFFFF',
  primaryGreen: '#15803D',
  primaryGreenSoft: '#16A34A',
  deepGreenA: '#0B5D34',
  deepGreenB: '#0F7A45',
  softGreen: '#E9F6EC',
  iconChipBorder: '#D9EDDE',
  primaryText: '#10221A',
  secondaryText: '#70807A',
  tertiaryText: '#98A39D',
  border: '#EAEFEC',
  divider: '#F0F3F1',
  gold: '#F0B429',
  shadow: 'rgba(16, 34, 26, 0.06)',
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

const IconChip = ({ children, size = 36, bg = COLORS.softGreen }) => (
  <View
    style={[
      styles.iconChip,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
    ]}
  >
    {children}
  </View>
);

const ProfileMenuRow = ({ icon, label, badge, hideDivider, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.6}
    style={[styles.menuRow, hideDivider && { borderBottomWidth: 0 }]}
    onPress={onPress}
  >
    <View style={styles.menuRowLeft}>
      <IconChip size={34}>{icon}</IconChip>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <View style={styles.menuRowRight}>
      {badge ? (
        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>{badge}</Text>
        </View>
      ) : null}
      <Feather name="chevron-right" size={18} color={COLORS.tertiaryText} />
    </View>
  </TouchableOpacity>
);

const StatColumn = ({ icon, value, label, withDivider, onPress }) => (
  <>
    <TouchableOpacity style={styles.statColumn} onPress={onPress} activeOpacity={0.7}>
      <IconChip size={38}>{icon}</IconChip>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
    {withDivider && <View style={styles.statDivider} />}
  </>
);

// A quiet leaf sprig, built from a few overlapping Ionicons leaves —
// echoes the reference art without needing an image asset.
const LeafSprig = () => (
  <View style={styles.leafSprig} pointerEvents="none">
    <Ionicons name="leaf" size={26} color="#CFE3D4" style={{ transform: [{ rotate: '18deg' }] }} />
    <Ionicons
      name="leaf"
      size={20}
      color="#DCEBDF"
      style={{ position: 'absolute', top: 18, left: 14, transform: [{ rotate: '-12deg' }] }}
    />
    <Ionicons
      name="leaf"
      size={16}
      color="#E7F2E9"
      style={{ position: 'absolute', top: 40, left: -2, transform: [{ rotate: '40deg' }] }}
    />
  </View>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

import { useStore } from '../../store/StoreContext';

const ProfileScreen = ({ onNavigate }) => {
  const { state } = useStore();
  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

  const totalOrders = state.orders.length;
  const totalSaved = totalOrders * 36;
  const totalPoints = totalOrders * 15 + 85;

  const userData = {
    name: state.user.name,
    email: state.user.email,
    orders: totalOrders.toString(),
    saved: `₹${totalSaved}`,
    points: totalPoints.toString(),
    language: 'English',
    appearance: 'Light',
  };

  const accountItems = [
    { id: '1', icon: <Feather name="user" size={16} color={COLORS.primaryGreen} />, label: 'Personal Information' },
    { id: '2', icon: <Feather name="map-pin" size={16} color={COLORS.primaryGreen} />, label: 'Saved Addresses' },
    { id: '3', icon: <Feather name="credit-card" size={16} color={COLORS.primaryGreen} />, label: 'Payment Methods' },
    { id: '4', icon: <Feather name="file-text" size={16} color={COLORS.primaryGreen} />, label: 'Order History', onPress: () => onNavigate && onNavigate('Orders') },
    { id: '5', icon: <Feather name="heart" size={16} color={COLORS.primaryGreen} />, label: 'Saved Items' },
  ];

  const preferenceItems = [
    { id: '1', icon: <Feather name="bell" size={16} color={COLORS.primaryGreen} />, label: 'Notifications' },
    { id: '2', icon: <Feather name="globe" size={16} color={COLORS.primaryGreen} />, label: 'Language', badge: userData.language },
    { id: '3', icon: <Feather name="moon" size={16} color={COLORS.primaryGreen} />, label: 'Appearance', badge: userData.appearance },
    { id: '4', icon: <Feather name="truck" size={16} color={COLORS.primaryGreen} />, label: 'Delivery Preferences' },
  ];

  const supportItems = [
    { id: '1', icon: <Feather name="help-circle" size={16} color={COLORS.primaryGreen} />, label: 'Help & Support' },
    { id: '2', icon: <Feather name="message-circle" size={16} color={COLORS.primaryGreen} />, label: 'Contact Us' },
    { id: '3', icon: <Feather name="shield" size={16} color={COLORS.primaryGreen} />, label: 'Terms & Privacy' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
                <Feather name="bell" size={19} color={COLORS.primaryText} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
                <Feather name="settings" size={19} color={COLORS.primaryText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* IDENTITY */}
          <View style={styles.identitySection}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Feather name="user" size={30} color="#B9C4BE" />
              </View>
            </View>
            <View style={styles.identityInfo}>
              <Text style={styles.identityName}>{userData.name}</Text>
              <Text style={styles.identityEmail}>{userData.email}</Text>
              <TouchableOpacity style={styles.editBtn} activeOpacity={0.75}>
                <Text style={styles.editBtnText}>Edit Profile</Text>
                <Feather name="edit-2" size={11} color={COLORS.primaryGreen} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>
            <LeafSprig />
          </View>

          {/* STATS */}
          <View style={styles.statsCard}>
            <StatColumn
              icon={<Feather name="shopping-bag" size={17} color={COLORS.primaryGreen} />}
              value={userData.orders}
              label="Orders"
              withDivider
              onPress={() => onNavigate && onNavigate('Orders')}
            />
            <StatColumn
              icon={<Feather name="tag" size={17} color={COLORS.primaryGreen} />}
              value={userData.saved}
              label="Saved"
              withDivider
            />
            <StatColumn
              icon={<Feather name="star" size={17} color={COLORS.primaryGreen} />}
              value={userData.points}
              label="QuickPoints"
            />
          </View>

          {/* REWARD CARD */}
          <LinearGradient
            colors={[COLORS.deepGreenB, COLORS.deepGreenA]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rewardCard}
          >
            {/* soft decorative circles */}
            <View style={styles.rewardCircleLg} pointerEvents="none" />
            <View style={styles.rewardCircleSm} pointerEvents="none" />

            <View style={styles.rewardContent}>
              <View style={styles.rewardTitleRow}>
                <View style={styles.rewardBoltChip}>
                  <Feather name="zap" size={11} color={COLORS.deepGreenA} />
                </View>
                <Text style={styles.rewardTitle}>QuickPoints</Text>
              </View>
              <Text style={styles.rewardValue}>{userData.points} Points</Text>
              <Text style={styles.rewardSub}>Redeem exciting rewards</Text>
              <TouchableOpacity style={styles.redeemBtn} activeOpacity={0.85}>
                <Text style={styles.redeemBtnText}>Redeem Now</Text>
                <Feather name="arrow-right" size={14} color={COLORS.primaryGreen} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>

            <View style={styles.rewardIllustration}>
              <View style={styles.giftBoxOuter}>
                <Ionicons name="gift" size={40} color="#FFFFFF" />
              </View>
              <Ionicons name="star" size={14} color={COLORS.gold} style={styles.sparkleA} />
              <Ionicons name="star" size={10} color="#FFFFFF" style={styles.sparkleB} />
              <Ionicons name="ellipse" size={8} color={COLORS.gold} style={styles.sparkleC} />
            </View>
          </LinearGradient>

          {/* MY ACCOUNT */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionHeading}>My Account</Text>
            <View style={styles.menuCard}>
              {accountItems.map((item, index) => (
                <ProfileMenuRow
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  hideDivider={index === accountItems.length - 1}
                  onPress={item.onPress}
                />
              ))}
            </View>
          </View>

          {/* PREFERENCES */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionHeading}>Preferences</Text>
            <View style={styles.menuCard}>
              {preferenceItems.map((item, index) => (
                <ProfileMenuRow
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  hideDivider={index === preferenceItems.length - 1}
                />
              ))}
            </View>
          </View>

          {/* SUPPORT */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionHeading}>Support</Text>
            <View style={styles.menuCard}>
              {supportItems.map((item, index) => (
                <ProfileMenuRow
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  hideDivider={index === supportItems.length - 1}
                />
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      <BottomNavigation activeTab="Profile" onNavigate={onNavigate} cartCount={cartCount} />
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
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 22,
  },
  headerTitle: { fontFamily: FONT.extrabold, fontSize: 26, color: COLORS.primaryText, letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', gap: 10 },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primaryGreenSoft,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },

  // Identity
  identitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 22,
    position: 'relative',
  },
  avatarWrap: {
    padding: 3,
    borderRadius: 44,
    backgroundColor: COLORS.softGreen,
    marginRight: 16,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#EFF3F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityInfo: { flex: 1, justifyContent: 'center' },
  identityName: { fontFamily: FONT.bold, fontSize: 19, color: COLORS.primaryText, marginBottom: 2 },
  identityEmail: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.secondaryText, marginBottom: 10 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  editBtnText: { fontFamily: FONT.semibold, fontSize: 12, color: COLORS.primaryGreen },
  leafSprig: {
    position: 'absolute',
    right: 6,
    top: -10,
    width: 60,
    height: 70,
  },

  // Stats card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  statColumn: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: FONT.bold, fontSize: 17, color: COLORS.primaryText, marginBottom: 2, letterSpacing: -0.2 },
  statLabel: { fontFamily: FONT.medium, fontSize: 11.5, color: COLORS.secondaryText },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },

  // Icon chip (shared by stats + menu rows)
  iconChip: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.iconChipBorder,
  },

  // Reward card
  rewardCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 22,
    marginBottom: 26,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: COLORS.deepGreenA,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  rewardCircleLg: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -40,
  },
  rewardCircleSm: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -30,
    right: 40,
  },
  rewardContent: { flex: 1.2 },
  rewardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rewardBoltChip: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },
  rewardTitle: { fontFamily: FONT.semibold, fontSize: 12.5, color: '#FFFFFF', letterSpacing: 0.2 },
  rewardValue: { fontFamily: FONT.extrabold, fontSize: 25, color: '#FFFFFF', marginBottom: 4, letterSpacing: -0.4 },
  rewardSub: { fontFamily: FONT.regular, fontSize: 13, color: 'rgba(255,255,255,0.78)', marginBottom: 16 },
  redeemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  redeemBtnText: { fontFamily: FONT.semibold, fontSize: 12.5, color: COLORS.primaryText },
  rewardIllustration: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  giftBoxOuter: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleA: { position: 'absolute', top: -6, right: -4 },
  sparkleB: { position: 'absolute', bottom: 0, left: -10 },
  sparkleC: { position: 'absolute', top: 14, left: -14 },

  // Menu sections
  menuSection: { marginBottom: 22, paddingHorizontal: 16 },
  sectionHeading: { fontFamily: FONT.bold, fontSize: 15, color: COLORS.primaryText, marginBottom: 12, letterSpacing: -0.1 },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center' },
  menuLabel: { fontFamily: FONT.semibold, fontSize: 13.5, color: COLORS.primaryText, marginLeft: 12 },
  menuRowRight: { flexDirection: 'row', alignItems: 'center' },
  menuBadge: {
    backgroundColor: COLORS.softGreen,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  menuBadgeText: { fontFamily: FONT.semibold, fontSize: 10.5, color: COLORS.primaryGreen },
});

export default ProfileScreen;
