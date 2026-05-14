# Navigation

File: `src/navigation/RootNavigator.tsx`

## Cấu trúc

```
Stack.Navigator (headerShown: false)
│
├── Screen 'Tabs'
│   └── BottomTabNavigator
│       ├── Tab 'Camera'   → CameraScreen
│       ├── Tab 'History'  → HistoryScreen
│       └── Tab 'Summary'  → SummaryScreen
│
└── Screen 'Preview'       → PreviewScreen
    (animation: slide_from_bottom)
```

## Stack vs Tab

### BottomTabNavigator (3 tabs chính)

| Tab | Component | Icon |
|---|---|---|
| Camera | `CameraScreen` | `camera` |
| History | `HistoryScreen` | `receipt-outline` |
| Summary | `SummaryScreen` | `bar-chart-outline` |

Thanh tab bottom có màu `Colors.surface`, tab active màu `Colors.accent` (vàng), inactive màu `Colors.textSecondary`.

### Stack — vì sao PreviewScreen không là tab?

`PreviewScreen` được push từ `CameraScreen` sau khi chụp ảnh. Đây là màn hình tạm thời (nhập thông tin xong là đóng), không phải điểm điều hướng cố định. Đặt trong Stack cho:

- Animation `slide_from_bottom` — cảm giác modal sheet
- Gesture swipe-down để đóng (iOS native)
- Không hiển thị tab bar trong PreviewScreen

## Type params

```typescript
// Stack routes
type RootStackParamList = {
  Tabs: undefined;
  Preview: { tempUri: string };  // URI ảnh tạm từ camera
};

// Tab routes
type TabParamList = {
  Camera: undefined;
  History: undefined;
  Summary: undefined;
};
```

## Cách navigate đến PreviewScreen

```typescript
// Trong CameraScreen
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

navigation.navigate('Preview', { tempUri: photo.uri });
```

## Cách đóng PreviewScreen

```typescript
// Trong PreviewScreen — sau khi lưu hoặc nhấn back
navigation.goBack();
```

## Theme

`NavigationContainer` nhận `customDarkTheme` — mở rộng từ `DarkTheme` của React Navigation với màu sắc từ `src/theme/index.ts`.

```typescript
const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,  // '#0A0A0A'
    card: Colors.surface,           // '#1A1A1A'
    border: Colors.border,          // '#2E2E2E'
    primary: Colors.accent,         // '#F5C542'
  },
};
```
