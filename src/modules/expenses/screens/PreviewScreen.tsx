import React, { useState } from 'react';
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
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import AmountInput from '../components/AmountInput';
import CategoryPicker from '../components/CategoryPicker';
import { Colors, Spacing, Radii } from '../../../shared/theme';
import { Category, Expense } from '../../../shared/types';
import { addExpense } from '../storage/expenseStorage';
import { copyPhotoToStorage } from '../../camera/storage/photoStorage';
import { RootStackParamList } from '../../../shared/navigation/RootNavigator';

type PreviewRoute = RouteProp<RootStackParamList, 'Preview'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PHOTO_HEIGHT = SCREEN_HEIGHT * 0.42;

export default function PreviewScreen() {
  const navigation = useNavigation();
  const route = useRoute<PreviewRoute>();
  const { tempUri } = route.params;
  const insets = useSafeAreaInsets();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');
  const [date] = useState(new Date());
  const [saving, setSaving] = useState(false);

  const parsedCents = Math.round(parseFloat(amount || '0') * 100);
  const canSave = parsedCents > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const id = Date.now().toString();
      const permanentUri = await copyPhotoToStorage(tempUri, id);
      const expense: Expense = {
        id,
        amount: parsedCents,
        category,
        note: note.trim(),
        date: format(date, 'yyyy-MM-dd'),
        photoUri: permanentUri,
        createdAt: new Date().toISOString(),
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
      {/* Photo */}
      <View style={{ height: PHOTO_HEIGHT }}>
        <Image source={{ uri: tempUri }} style={styles.photo} resizeMode="cover" />
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 12 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-down" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView
        style={styles.form}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <AmountInput value={amount} onChange={setAmount} />

        <Text style={styles.label}>Category</Text>
        <CategoryPicker selected={category} onChange={setCategory} />

        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="What did you buy? (optional)"
          placeholderTextColor={Colors.textSecondary}
          returnKeyType="done"
          selectionColor={Colors.accent}
        />

        <Text style={styles.label}>Date</Text>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.dateText}>{format(date, 'EEEE, MMMM d, yyyy')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save Expense'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  photo: {
    flex: 1,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  formContent: {
    paddingTop: Spacing.md,
    gap: 4,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  noteInput: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    color: Colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateText: {
    color: Colors.text,
    fontSize: 15,
  },
  saveButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    backgroundColor: Colors.accent,
    borderRadius: Radii.full,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
});
