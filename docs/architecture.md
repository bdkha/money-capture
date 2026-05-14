# Kiến trúc ứng dụng

## Tổng quan

money-capture được thiết kế theo kiến trúc **feature-first** nhẹ, phù hợp cho ứng dụng mobile cá nhân quy mô nhỏ. Không dùng state management toàn cục (Redux, Zustand) — state được quản lý cục bộ qua custom hooks và truyền xuống component qua props.

```
┌─────────────────────────────────────────────────────┐
│                      App.tsx                        │
│   GestureHandlerRootView → NavigationContainer      │
└───────────────────┬─────────────────────────────────┘
                    │
         ┌──────────▼──────────┐
         │   RootNavigator     │  (Stack)
         │   ┌─────────────┐   │
         │   │ TabNavigator│   │  (BottomTabs)
         │   │ ┌─────────┐ │   │
         │   │ │ Camera  │ │   │
         │   │ │ History │ │   │
         │   │ │ Summary │ │   │
         │   │ └─────────┘ │   │
         │   └─────────────┘   │
         │   PreviewScreen     │  (pushed on capture)
         └─────────────────────┘
```

## Luồng dữ liệu chính

```
Người dùng chụp ảnh
       │
       ▼
CameraScreen.handleCapture()
  └─ takePictureAsync() → tempUri (cache)
  └─ navigate('Preview', { tempUri })
       │
       ▼
PreviewScreen.handleSave()
  └─ copyPhotoToStorage(tempUri, id) → permanentUri
  └─ addExpense({ id, amount, category, note, date, photoUri, createdAt })
       │
       ▼
expenseStorage.addExpense()
  └─ loadExpenses() từ AsyncStorage
  └─ prepend expense mới
  └─ saveExpenses() vào AsyncStorage
       │
       ▼
navigation.goBack() → CameraScreen
       │
       ▼
HistoryScreen / SummaryScreen (khi focus)
  └─ useFocusEffect → refresh()
  └─ useExpenses() → load từ AsyncStorage
  └─ render danh sách / biểu đồ
```

## Quyết định thiết kế quan trọng

### 1. Lưu số tiền bằng cents (số nguyên)

```typescript
// Sai — float drift
expense.amount = 15.99  // 15.989999999... sau nhiều phép cộng

// Đúng — lưu cents
expense.amount = 1599   // hiển thị: (1599 / 100).toFixed(2) = "15.99"
```

Tất cả số tiền trong toàn bộ codebase đều là **số nguyên cents**. Chỉ chuyển sang dollars khi hiển thị.

### 2. Ảnh phải copy ra khỏi cache

```
expo-camera.takePictureAsync() → file:///data/user/.../cache/Camera/temp_123.jpg
                                           ↑ OS có thể xoá bất kỳ lúc nào
copyPhotoToStorage() →
  file:///data/user/.../files/money-capture/photos/1747200000000.jpg
                        ↑ documentDirectory — an toàn, không bị xoá tự động
```

`photoStorage.copyPhotoToStorage()` luôn được gọi trước khi lưu `Expense` vào AsyncStorage. URI trong database luôn trỏ đến `documentDirectory`.

### 3. PreviewScreen nằm trong Stack, không phải Tab

```
Stack
├── Tabs (BottomTabNavigator)
│   ├── Camera
│   ├── History
│   └── Summary
└── Preview  ← không có tab bar, animation slide_from_bottom
```

Lý do: PreviewScreen là màn hình modal-style (slide từ dưới lên, back để đóng). Đặt trong Stack cho phép dùng gesture back tự nhiên trên iOS và animation phù hợp.

### 4. AsyncStorage — ghi lại toàn bộ mảng

Mỗi lần thêm/xoá, toàn bộ mảng được đọc, sửa đổi, rồi ghi lại:

```typescript
addExpense → loadExpenses → [expense, ...existing] → saveExpenses
deleteExpense → loadExpenses → filter → saveExpenses
```

Đây là chiến lược đơn giản, phù hợp với quy mô hàng trăm đến vài nghìn bản ghi. Nếu dataset lớn hơn, cần migrate sang `expo-sqlite`.

### 5. State refresh khi tab được focus

```typescript
useFocusEffect(
  React.useCallback(() => { refresh(); }, [refresh])
);
```

HistoryScreen và SummaryScreen đều dùng `useFocusEffect` để tự động load lại dữ liệu khi người dùng quay lại tab. Điều này đảm bảo dữ liệu luôn đồng bộ sau khi lưu expense mới từ PreviewScreen.

## Cấu trúc module

```
src/
├── types/          ← data model, không phụ thuộc gì
├── theme/          ← constants UI, phụ thuộc types
├── storage/        ← I/O layer, phụ thuộc types
├── hooks/          ← business logic, phụ thuộc storage + types
├── navigation/     ← routing, phụ thuộc screens
├── screens/        ← UI tổng hợp, phụ thuộc hooks + components + storage
└── components/     ← UI nguyên tử, phụ thuộc types + theme
```

Các module cấp thấp (`types`, `theme`) không import từ module cấp cao. Không có circular dependencies.
