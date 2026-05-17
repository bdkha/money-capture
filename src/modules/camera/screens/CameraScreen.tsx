import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

import ShutterButton from '../components/ShutterButton';
import { Colors, Spacing, Radii, FontNames } from '../../../shared/theme';
import { RootStackParamList } from '../../../shared/navigation/RootNavigator';
import { useExpenses } from '../../expenses/hooks/useExpenses';
import { useStreak } from '../../profile/hooks/useStreak';
import { formatVND } from '../../../shared/utils/currency';
import { useI18n } from '../../../shared/i18n/I18nContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<RootStackParamList>;

type CaptureMode = string;

const LAST_CAPTURE_KEY = '@chopp:last_capture';


// ─── Styles ───────────────────────────────────────────────────────────────────

// Camera screen is always dark — use static Colors for camera-specific colors
const styles = StyleSheet.create({
  // ── Containers ──────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.camBg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.camBg,
  },

  // ── Permission denied ────────────────────────────────────────────────────────
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.camBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: FontNames.title,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  permissionBody: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
    fontFamily: FontNames.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: Colors.orange,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    marginTop: Spacing.md,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontFamily: FontNames.bodySemi,
    fontSize: 16,
  },

  // ── Vignettes ────────────────────────────────────────────────────────────────
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    pointerEvents: 'none',
  } as any,
  vignetteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    pointerEvents: 'none',
  } as any,

  // ── Top overlay ──────────────────────────────────────────────────────────────
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },

  // ── Glass pills ──────────────────────────────────────────────────────────────
  glassPill: {
    backgroundColor: 'rgba(20,14,10,0.55)',
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: FontNames.bodyMed,
  },
  flashButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(20,14,10,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Bottom overlay ───────────────────────────────────────────────────────────
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // ── Mode tabs ────────────────────────────────────────────────────────────────
  modeTabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  modeTabText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: FontNames.bodyMed,
    letterSpacing: 0.3,
  },
  modeTabActive: {
    color: '#FFFFFF',
    fontFamily: FontNames.bodySemi,
    textShadowColor: Colors.orange,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // ── Shutter row ──────────────────────────────────────────────────────────────
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'android' ? Spacing.xl : Spacing.lg,
    paddingTop: Spacing.sm,
  },

  // ── Thumbnail ────────────────────────────────────────────────────────────────
  thumbnailSlot: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailEmpty: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // ── Flip button ──────────────────────────────────────────────────────────────
  flipButton: {
    width: 52,
    height: 52,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function CameraScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  const MODES: CaptureMode[] = [t.camera.modeReceipt, t.camera.modeQuick, t.camera.modeManual];

  const [facing, setFacing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [lastUri, setLastUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CaptureMode>(t.camera.modeQuick);

  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();

  const { expenses } = useExpenses();
  const { currentStreak } = useStreak(expenses);

  // ── Load persisted last-capture thumbnail on mount ─────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(LAST_CAPTURE_KEY)
      .then((uri) => {
        if (uri) setLastUri(uri);
      })
      .catch(() => {
        // ignore storage errors
      });
  }, []);

  // ── Derived: today's total spend ───────────────────────────────────────────
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todaySpend = expenses
    .filter((e) => e.date === todayKey)
    .reduce((sum, e) => sum + e.amount, 0);

  // ── Capture handler ────────────────────────────────────────────────────────
  const handleCapture = useCallback(async () => {
    if (capturing || !cameraRef.current) return;
    setCapturing(true);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        // Persist thumbnail for next session
        await AsyncStorage.setItem(LAST_CAPTURE_KEY, photo.uri);
        setLastUri(photo.uri);
        navigation.navigate('Preview', { tempUri: photo.uri });
      }
    } finally {
      setCapturing(false);
    }
  }, [capturing, navigation]);

  const toggleFacing = useCallback(() => {
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  }, []);

  // ── Permission loading ─────────────────────────────────────────────────────
  if (!permission) {
    return <View style={styles.loadingContainer} />;
  }

  // ── Permission denied ──────────────────────────────────────────────────────
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={Colors.inkTextSecondary} />
        <Text style={styles.permissionTitle}>Cần quyền camera</Text>
        <Text style={styles.permissionBody}>
          Chụp cần truy cập máy ảnh để chụp hoá đơn và chi tiêu của bạn.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Cho phép</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main camera UI ─────────────────────────────────────────────────────────
  const flashMode: FlashMode = flashOn ? 'on' : 'off';

  return (
    <View style={styles.container}>
      {/* Camera feed */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flashMode}
      />

      {/* Vignette — top */}
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent']}
        style={styles.vignetteTop}
        pointerEvents="none"
      />

      {/* Vignette — bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={styles.vignetteBottom}
        pointerEvents="none"
      />

      {/* ── Top overlay ──────────────────────────────────────────────────── */}
      <View style={[styles.topOverlay, { paddingTop: insets.top }]}>
        <View style={styles.topRow}>
          {/* Streak pill */}
          <View style={styles.glassPill}>
            <Text style={styles.pillText}>🔥 {currentStreak} {t.feed.streakDays}</Text>
          </View>

          {/* Today's spend pill */}
          <View style={styles.glassPill}>
            <Text style={styles.pillText}>{t.feed.today}: {formatVND(todaySpend)}</Text>
          </View>

          {/* Flash toggle */}
          <TouchableOpacity
            onPress={() => setFlashOn((f) => !f)}
            style={styles.flashButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={flashOn ? 'flash' : 'flash-off'}
              size={22}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Bottom overlay ───────────────────────────────────────────────── */}
      <View style={[styles.bottomOverlay, { paddingBottom: insets.bottom }]}>
        {/* Mode selector tabs */}
        <View style={styles.modeTabRow}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text
                style={[
                  styles.modeTabText,
                  mode === m && styles.modeTabActive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shutter row */}
        <View style={styles.shutterRow}>
          {/* Last capture thumbnail */}
          <TouchableOpacity
            style={styles.thumbnailSlot}
            activeOpacity={0.75}
          >
            {lastUri ? (
              <Image source={{ uri: lastUri }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailEmpty} />
            )}
          </TouchableOpacity>

          <ShutterButton onPress={handleCapture} disabled={capturing} />

          {/* Camera flip */}
          <TouchableOpacity
            onPress={toggleFacing}
            style={styles.flipButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="camera-reverse-outline" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
