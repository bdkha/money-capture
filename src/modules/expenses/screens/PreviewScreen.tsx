import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AmountInput from '../components/AmountInput';
import CategoryPicker from '../components/CategoryPicker';
import MoodPicker from '../components/MoodPicker';
import { Colors, Spacing, Radii, FontNames } from '../../../shared/theme';
import { Category, Expense, Mood } from '../../../shared/types';
import { addExpense } from '../storage/expenseStorage';
import { copyPhotoToStorage } from '../../camera/storage/photoStorage';
import { RootStackParamList } from '../../../shared/navigation/RootNavigator';

type PreviewRoute = RouteProp<RootStackParamList, 'Preview'>;

export default function PreviewScreen() {
  const navigation = useNavigation();
  const route = useRoute<PreviewRoute>();
  const { tempUri } = route.params;
  const insets = useSafeAreaInsets();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<Category>('Cafe');
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const parsedAmount = parseInt(amount || '0', 10);
  const canSave = parsedAmount > 0 && !saving;

  // Animated slide-up for the glass card
  const translateY = useSharedValue(400);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 120,
    });
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const id = Date.now().toString();
      const permanentUri = await copyPhotoToStorage(tempUri, id);
      const expense: Expense = {
        id,
        amount: parsedAmount,
        category,
        note: note.trim(),
        date: format(new Date(), 'yyyy-MM-dd'),
        photoUri: permanentUri,
        createdAt: new Date().toISOString(),
        mood,
      };
      await addExpense(expense);
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Full-screen photo */}
      <Image
        source={{ uri: tempUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Vignette gradient overlay */}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.3)',
          'transparent',
          'transparent',
          'rgba(0,0,0,0.6)',
        ]}
        locations={[0, 0.2, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Top bar */}
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 8 },
        ]}
      >
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* AI pill */}
        <View style={styles.aiPill}>
          <Text style={styles.aiPillText}>AI xong ✓</Text>
        </View>

        {/* Retake button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <Text style={styles.retakeText}>Chụp lại</Text>
        </TouchableOpacity>
      </View>

      {/* Animated glass card */}
      <Animated.View style={[styles.glassCard, { paddingBottom: insets.bottom + 16 }, animatedCardStyle]}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        {/* Amount input */}
        <AmountInput value={amount} onChange={setAmount} />

        {/* Merchant / note input */}
        <TextInput
          style={styles.noteInput}
          placeholder="Tên cửa hàng / ghi chú"
          placeholderTextColor={Colors.inkTextSecondary}
          value={note}
          onChangeText={setNote}
          returnKeyType="done"
        />

        {/* Category label + picker */}
        <Text style={styles.sectionLabel}>Danh mục</Text>
        <CategoryPicker selected={category} onChange={setCategory} />

        {/* Mood picker (includes its own "Cảm xúc" label) */}
        <MoodPicker selected={mood} onChange={setMood} />

        {/* Save button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            !canSave && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Lưu khoản chi</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 12,
    zIndex: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPill: {
    backgroundColor: 'rgba(47,135,105,0.85)',
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  aiPillText: {
    fontFamily: FontNames.bodyMed,
    fontSize: 12,
    color: '#FFFFFF',
  },
  retakeText: {
    fontFamily: FontNames.bodyMed,
    fontSize: 13,
    color: '#FFFFFF',
  },
  glassCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(251,246,238,0.96)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.8)',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.ink3,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  noteInput: {
    fontFamily: FontNames.body,
    fontSize: 15,
    color: Colors.inkTextPrimary,
    backgroundColor: Colors.ink1,
    borderRadius: Radii.md,
    padding: 12,
    marginHorizontal: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: FontNames.body,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.inkTextSecondary,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.orange,
    borderRadius: Radii.full,
    paddingVertical: 14,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontFamily: FontNames.title,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
