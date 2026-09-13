import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// -----------------------------------------------------------------------
// COLORS
// -----------------------------------------------------------------------
const COLORS = {
  bg: '#EFF4EC',
  card: '#FFFFFF',
  green: '#1C7C4B',
  greenDark: '#155E3A',
  greenLight: '#E3F1E5',
  greenPill: '#DCEEDD',
  textDark: '#1B2B22',
  textGray: '#7C8A80',
  textMuted: '#9AA79E',
  border: '#E4EAE2',
  inactive: '#D8DED6',
  blueRiver: '#BFDCE8',
};

// -----------------------------------------------------------------------
// TIMELINE DATA
// -----------------------------------------------------------------------
const TIMELINE = [
  {
    key: 'placed',
    icon: <Feather name="repeat" size={16} color={COLORS.green} />,
    title: 'Order Placed',
    time: '9:12 AM',
    desc: 'Your order has been confirmed',
    status: 'done',
  },
  {
    key: 'picking',
    icon: <MaterialCommunityIcons name="storefront-outline" size={16} color={COLORS.green} />,
    title: 'Store Picking',
    time: '9:18 AM',
    desc: 'Items are being collected from the store',
    status: 'done',
  },
  {
    key: 'packing',
    icon: <Feather name="package" size={16} color={COLORS.green} />,
    title: 'Packing',
    time: '9:26 AM',
    desc: 'Your order is being packed',
    status: 'current',
  },
  {
    key: 'rider',
    icon: <MaterialCommunityIcons name="moped" size={16} color={COLORS.textMuted} />,
    title: 'Rider Assigned',
    time: '9:32 AM',
    desc: 'Your delivery partner is on the way',
    status: 'pending',
  },
  {
    key: 'arriving',
    icon: <Ionicons name="home-outline" size={16} color={COLORS.textMuted} />,
    title: 'Arriving Soon',
    time: '~ 12 min',
    desc: 'At your doorstep',
    status: 'pending',
  },
];

// -----------------------------------------------------------------------
// SCREEN
// -----------------------------------------------------------------------
export default function OrderTrackingScreen({ onNavigate }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- HEADER ---------------- */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate && onNavigate('Home')}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
          </TouchableOpacity>

          <View style={styles.orderBadge}>
            <Text style={styles.orderBadgeText}>Order #QF58931245</Text>
            <Feather name="copy" size={14} color={COLORS.green} style={{ marginLeft: 6 }} />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>
            <Text style={styles.titleLive}>Live </Text>
            <Text style={styles.titleRest}>Order Tracking</Text>
          </Text>
          <Text style={styles.subtitleText}>
            Your order is on the way <Text>{'\u2764\uFE0F'}</Text>
          </Text>
        </View>

        {/* ---------------- ITEM SUMMARY CARD ---------------- */}
        <TouchableOpacity style={styles.itemCard} activeOpacity={0.8}>
          <Image
            source={{ uri: 'https://via.placeholder.com/56' }}
            style={styles.itemImage}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.itemTitle}>Amul Taaza Milk</Text>
            <Text style={styles.itemSubtitle}>1 L • Pouch</Text>
            <Text style={styles.itemMeta}>3 items • ₹151</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* ---------------- MAP PLACEHOLDER ---------------- */}
        <View style={styles.mapWrapper}>
          <View style={styles.mapPlaceholder}>
            <Feather name="map" size={28} color={COLORS.textMuted} />
            <Text style={styles.mapPlaceholderText}>Map goes here</Text>
          </View>

          {/* Rider "arriving in" bubble */}
          <View style={styles.riderBubble}>
            <Text style={styles.riderBubbleTitle}>Rider is on the way</Text>
            <Text style={styles.riderBubbleSubtitle}>Arriving in 12 min</Text>
          </View>

          {/* Map controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapControlButton}>
              <Feather name="crosshair" size={18} color={COLORS.textDark} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mapControlButton, { marginTop: 8 }]}>
              <Feather name="layers" size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Live location pill */}
          <View style={styles.liveLocationPill}>
            <Ionicons name="location" size={14} color={COLORS.green} />
            <Text style={styles.liveLocationText}>Live location</Text>
          </View>
        </View>

        {/* ---------------- TIMELINE ---------------- */}
        <View style={styles.timelineCard}>
          <View style={styles.freshBadge}>
            <Text style={styles.freshBadgeText}>Fresh{'\n'}& on time <Text>{'\u2764\uFE0F'}</Text></Text>
          </View>

          {TIMELINE.map((step, index) => {
            const isLast = index === TIMELINE.length - 1;
            const isDone = step.status === 'done';
            const isCurrent = step.status === 'current';

            return (
              <View key={step.key} style={styles.timelineRow}>
                {/* Left rail: dot + connecting line */}
                <View style={styles.timelineRail}>
                  <View
                    style={[
                      styles.timelineDot,
                      isDone && styles.timelineDotDone,
                      isCurrent && styles.timelineDotCurrent,
                    ]}
                  >
                    {isDone && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    {isCurrent && <View style={styles.timelineDotInner} />}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        isDone && styles.timelineLineDone,
                      ]}
                    />
                  )}
                </View>

                {/* Icon bubble */}
                <View
                  style={[
                    styles.timelineIconBubble,
                    (isDone || isCurrent) && styles.timelineIconBubbleActive,
                  ]}
                >
                  {step.icon}
                </View>

                {/* Text content */}
                <View style={{ flex: 1, marginLeft: 12, paddingBottom: isLast ? 0 : 20 }}>
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                  <Text style={styles.timelineDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ---------------- DELIVERY PARTNER CARD ---------------- */}
        <View style={styles.partnerCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/48' }}
            style={styles.partnerAvatar}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.partnerName}>Rohit Kumar</Text>
            <Text style={styles.partnerRole}>Delivery Partner</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Ionicons name="star" size={12} color={COLORS.green} />
              <Text style={styles.partnerRating}> 4.8 (1.2k deliveries)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.partnerActionButton}>
            <Ionicons name="call" size={16} color={COLORS.green} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.partnerActionButton, { marginLeft: 8 }]}>
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.green} />
          </TouchableOpacity>

          <View style={styles.vehicleBlock}>
            <MaterialCommunityIcons name="moped" size={28} color={COLORS.green} />
            <View style={styles.plateBadge}>
              <Text style={styles.plateBadgeText}>DL 8S 7421</Text>
            </View>
          </View>
        </View>

        {/* ---------------- FOOTER: ESTIMATED DELIVERY ---------------- */}
        <View style={styles.footerCard}>
          <View style={styles.footerLeft}>
            <View style={styles.footerClockCircle}>
              <Feather name="clock" size={16} color={COLORS.green} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.footerLabel}>Estimated delivery</Text>
              <Text style={styles.footerTime}>11:42 AM</Text>
            </View>
          </View>

          <View style={styles.footerAwayPill}>
            <Text style={styles.footerAwayText}>12 min away</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.viewDetailsButton} activeOpacity={0.8}>
          <Text style={styles.viewDetailsText}>View order details</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.green} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  orderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  // Title block
  titleBlock: {
    marginTop: 18,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 26,
  },
  titleLive: {
    fontFamily: undefined, // swap for an italic/script font if available, e.g. 'PlayfairDisplay-Italic'
    fontStyle: 'italic',
    color: COLORS.green,
    fontWeight: '600',
  },
  titleRest: {
    color: COLORS.textDark,
    fontWeight: '800',
  },
  subtitleText: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 4,
  },

  // Item card
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.border,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  itemSubtitle: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 4,
  },

  // Map placeholder
  mapWrapper: {
    height: 340,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5EDE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  riderBubble: {
    position: 'absolute',
    top: 16,
    left: '50%',
    transform: [{ translateX: -90 }],
    width: 180,
    backgroundColor: COLORS.greenDark,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  riderBubbleTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  riderBubbleSubtitle: {
    color: '#DCEEDD',
    fontSize: 11,
    marginTop: 2,
  },
  mapControls: {
    position: 'absolute',
    right: 12,
    top: 70,
  },
  mapControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  liveLocationPill: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  liveLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    marginLeft: 6,
  },

  // Timeline
  timelineCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  freshBadge: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: COLORS.greenLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    transform: [{ rotate: '-4deg' }],
  },
  freshBadgeText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.greenDark,
    textAlign: 'center',
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineRail: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: {
    backgroundColor: COLORS.green,
  },
  timelineDotCurrent: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.inactive,
    marginTop: 2,
  },
  timelineLineDone: {
    backgroundColor: COLORS.green,
  },
  timelineIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  timelineIconBubbleActive: {
    backgroundColor: COLORS.greenLight,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  timelineTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  timelineDesc: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },

  // Delivery partner card
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLight,
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.border,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  partnerRole: {
    fontSize: 11,
    color: COLORS.textGray,
    marginTop: 1,
  },
  partnerRating: {
    fontSize: 11,
    color: COLORS.textDark,
  },
  partnerActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleBlock: {
    alignItems: 'center',
    marginLeft: 12,
  },
  plateBadge: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  plateBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.green,
  },

  // Footer
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerClockCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLabel: {
    fontSize: 11,
    color: COLORS.textGray,
  },
  footerTime: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 2,
  },
  footerAwayPill: {
    backgroundColor: COLORS.greenPill,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  footerAwayText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.greenDark,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.green,
    borderRadius: 24,
    paddingVertical: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.green,
    marginRight: 6,
  },
});