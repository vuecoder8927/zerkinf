import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ME = { name: 'Alex Morgan', initial: 'A', color: '#6C63FF' };

const FRIENDS = [
  { id: '1', name: 'Sarah',  initial: 'S', color: '#FF6584', online: true  },
  { id: '2', name: 'James',  initial: 'J', color: '#43B89C', online: true  },
  { id: '3', name: 'Priya',  initial: 'P', color: '#F4A261', online: false },
  { id: '4', name: 'Leo',    initial: 'L', color: '#9B5DE5', online: true  },
  { id: '5', name: 'Nina',   initial: 'N', color: '#E63946', online: false },
  { id: '6', name: 'Omar',   initial: 'O', color: '#2EC4B6', online: true  },
  { id: '7', name: 'Tasha',  initial: 'T', color: '#F77F00', online: false },
];

const TOP_FRIENDS = [
  { id: '1', name: 'Sarah K.',  initial: 'S', color: '#FF6584', followers: '12.4K', following: false },
  { id: '2', name: 'James T.',  initial: 'J', color: '#43B89C', followers: '9.8K',  following: true  },
  { id: '3', name: 'Priya M.', initial: 'P', color: '#F4A261', followers: '7.2K',  following: false },
  { id: '4', name: 'Leo R.',    initial: 'L', color: '#9B5DE5', followers: '5.1K',  following: true  },
];

const FEED = [
  {
    id: '1',
    user: 'Sarah K.',
    initial: 'S',
    color: '#FF6584',
    time: '2m ago',
    content: 'Just finished a 10K run this morning! New personal best 🏃‍♀️🔥',
    likes: 48,
    comments: 12,
  },
  {
    id: '2',
    user: 'James T.',
    initial: 'J',
    color: '#43B89C',
    time: '18m ago',
    content: 'Rooftop sunset views are something else. Grateful for these moments 🌇',
    likes: 134,
    comments: 27,
  },
  {
    id: '3',
    user: 'Leo R.',
    initial: 'L',
    color: '#9B5DE5',
    time: '1h ago',
    content: 'Finally shipped the side project I\'ve been building for 3 months. It\'s live! 🚀',
    likes: 203,
    comments: 41,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ initial, color, size = 44 }) {
  return (
    <View style={[
      styles.avatar,
      { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
    ]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initial}</Text>
    </View>
  );
}

function Header({ notifications }) {
  return (
    <View style={styles.header}>
      <Text style={styles.appName}>Zerkle</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color="#1A1A2E" />
          {notifications > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notifications}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <Avatar initial={ME.initial} color={ME.color} size={34} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PostComposer() {
  return (
    <View style={styles.card}>
      <View style={styles.composerRow}>
        <Avatar initial={ME.initial} color={ME.color} size={42} />
        <TouchableOpacity style={styles.composerInput} activeOpacity={0.6}>
          <Text style={styles.composerPlaceholder}>What's on your mind, Alex?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.composerDivider} />
      <View style={styles.composerActions}>
        <TouchableOpacity style={styles.composerBtn} activeOpacity={0.7}>
          <Ionicons name="image-outline" size={19} color="#43B89C" />
          <Text style={styles.composerBtnText}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.composerBtn} activeOpacity={0.7}>
          <Ionicons name="videocam-outline" size={19} color="#FF6584" />
          <Text style={styles.composerBtnText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.composerBtn} activeOpacity={0.7}>
          <Ionicons name="location-outline" size={19} color="#F4A261" />
          <Text style={styles.composerBtnText}>Check In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FriendsStrip() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Friends</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stripList}
      >
        {FRIENDS.map((f) => (
          <TouchableOpacity key={f.id} style={styles.stripItem} activeOpacity={0.75}>
            <View style={styles.stripAvatarWrap}>
              <Avatar initial={f.initial} color={f.color} size={54} />
              {f.online && <View style={styles.onlineDot} />}
            </View>
            <Text style={styles.stripName} numberOfLines={1}>{f.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function TopFriendsGrid() {
  const [followed, setFollowed] = useState(
    TOP_FRIENDS.reduce((acc, f) => ({ ...acc, [f.id]: f.following }), {})
  );

  const toggle = (id) => setFollowed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Friends</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>Explore</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {TOP_FRIENDS.map((f) => (
          <TouchableOpacity key={f.id} style={styles.gridCard} activeOpacity={0.85}>
            <Avatar initial={f.initial} color={f.color} size={58} />
            <Text style={styles.gridName} numberOfLines={1}>{f.name}</Text>
            <View style={styles.gridFollowers}>
              <Ionicons name="people-outline" size={11} color="#999" />
              <Text style={styles.gridFollowersText}>{f.followers}</Text>
            </View>
            <TouchableOpacity
              style={[styles.followBtn, followed[f.id] && styles.followBtnActive]}
              onPress={() => toggle(f.id)}
              activeOpacity={0.75}
            >
              <Text style={[styles.followBtnText, followed[f.id] && styles.followBtnTextActive]}>
                {followed[f.id] ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function FeedPost({ post }) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Avatar initial={post.initial} color={post.color} size={40} />
        <View style={styles.postMeta}>
          <Text style={styles.postUser}>{post.user}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#bbb" />
        </TouchableOpacity>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.reactionBtn} onPress={() => setLiked((v) => !v)} activeOpacity={0.7}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? '#FF6584' : '#aaa'}
          />
          <Text style={[styles.reactionText, liked && { color: '#FF6584' }]}>
            {liked ? post.likes + 1 : post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionBtn} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={18} color="#aaa" />
          <Text style={styles.reactionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-redo-outline" size={20} color="#aaa" />
          <Text style={styles.reactionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Feed() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </View>
      {FEED.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <Header notifications={3} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PostComposer />
        <FriendsStrip />
        <TopFriendsGrid />
        <Feed />
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_RADIUS = 16;
const BG = '#F2F3F7';
const CARD = '#FFFFFF';
const PRIMARY = '#6C63FF';
const TEXT1 = '#1A1A2E';
const TEXT2 = '#6B7280';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: PRIMARY,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    padding: 7,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6584',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },

  // Avatar
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
  },

  // Layout
  scroll: { flex: 1 },
  scrollContent: { paddingVertical: 12, gap: 10 },
  bottomPad: { height: 20 },

  // Card / Section
  card: {
    backgroundColor: CARD,
    marginHorizontal: 14,
    borderRadius: CARD_RADIUS,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  section: {
    backgroundColor: CARD,
    marginHorizontal: 14,
    borderRadius: CARD_RADIUS,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT1,
  },
  seeAll: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: '600',
  },

  // Post Composer
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  composerInput: {
    flex: 1,
    backgroundColor: BG,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  composerPlaceholder: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  composerDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  composerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  composerBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT2,
  },

  // Friends Strip
  stripList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  stripItem: {
    alignItems: 'center',
    gap: 6,
    width: 62,
  },
  stripAvatarWrap: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: CARD,
  },
  stripName: {
    fontSize: 12,
    color: TEXT2,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Top Friends Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 10,
  },
  gridCard: {
    width: '47%',
    backgroundColor: BG,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  gridName: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT1,
    textAlign: 'center',
  },
  gridFollowers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  gridFollowersText: {
    fontSize: 12,
    color: TEXT2,
  },
  followBtn: {
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  followBtnActive: {
    backgroundColor: PRIMARY,
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY,
  },
  followBtnTextActive: {
    color: '#fff',
  },

  // Feed
  postCard: {
    marginHorizontal: 14,
    marginBottom: 10,
    padding: 14,
    backgroundColor: BG,
    borderRadius: 14,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  postMeta: {
    flex: 1,
  },
  postUser: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT1,
  },
  postTime: {
    fontSize: 12,
    color: TEXT2,
    marginTop: 1,
  },
  postContent: {
    fontSize: 14,
    color: TEXT1,
    lineHeight: 21,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    justifyContent: 'space-around',
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  reactionText: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '500',
  },
});
