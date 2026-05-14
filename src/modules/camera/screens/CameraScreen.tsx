import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import ShutterButton from '../components/ShutterButton';
import { Colors, Spacing } from '../../../shared/theme';
import { RootStackParamList } from '../../../shared/navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          money-capture needs camera access to photograph your receipts.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (capturing || !cameraRef.current) return;
    setCapturing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        navigation.navigate('Preview', { tempUri: photo.uri });
      }
    } finally {
      setCapturing(false);
    }
  };

  const toggleFacing = () => {
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

      {/* Top overlay */}
      <SafeAreaView style={styles.topOverlay}>
        <View style={styles.topRow}>
          <Text style={styles.appTitle}>money-capture</Text>
        </View>
      </SafeAreaView>

      {/* Bottom overlay */}
      <SafeAreaView style={styles.bottomOverlay}>
        <View style={styles.bottomRow}>
          <View style={styles.sideSlot} />
          <ShutterButton onPress={handleCapture} disabled={capturing} />
          <View style={styles.sideSlot}>
            <TouchableOpacity onPress={toggleFacing} style={styles.iconButton}>
              <Ionicons name="camera-reverse-outline" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  permissionTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  permissionText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 100,
    marginTop: Spacing.md,
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topRow: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  sideSlot: {
    width: 48,
    alignItems: 'center',
  },
  iconButton: {
    padding: Spacing.sm,
  },
});
