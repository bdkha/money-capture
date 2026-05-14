# Screens

---

## CameraScreen — `src/screens/CameraScreen.tsx`

Màn hình chính của ứng dụng. Hiển thị viewfinder camera toàn màn hình ngay khi mở app.

### Bố cục

```
┌─────────────────────────┐
│  [  money-capture  ]    │  ← tiêu đề app (mờ, overlay)
│                         │
│                         │
│    [Camera viewfinder]  │
│                         │
│                         │
│         [ ◉ ]    [⇄]   │  ← shutter button + flip camera
└─────────────────────────┘
```

### Xử lý quyền camera

```typescript
const [permission, requestPermission] = useCameraPermissions();

if (!permission)         → render loading (View rỗng)
if (!permission.granted) → render màn hình xin quyền với nút "Allow Camera"
else                     → render CameraView
```

### Luồng chụp ảnh

```
Nhấn ShutterButton
  → setCapturing(true)   (disable nút, tránh double-tap)
  → Haptics.impactAsync(Medium)
  → cameraRef.current.takePictureAsync({ quality: 0.8 })
  → navigate('Preview', { tempUri: photo.uri })
  → setCapturing(false)  (trong finally)
```

Tham số `quality: 0.8` giảm dung lượng file ~20% so với chất lượng gốc mà vẫn rõ nét đủ để đọc số trên hoá đơn.

### Props / State

| State | Kiểu | Mô tả |
|---|---|---|
| `facing` | `'back' \| 'front'` | Camera trước hay sau |
| `capturing` | `boolean` | Đang xử lý chụp, disable nút |

---

## PreviewScreen — `src/screens/PreviewScreen.tsx`

Màn hình nhập thông tin chi tiêu sau khi chụp ảnh.

### Route params

```typescript
{ tempUri: string }  // URI ảnh tạm từ CameraScreen
```

### Bố cục

```
┌─────────────────────────┐
│  [↓]                    │  ← nút back (chevron-down)
│                         │
│   [Ảnh hoá đơn ~42%]   │
│                         │
├─────────────────────────┤
│   $ [    48.00    ]     │  ← AmountInput (auto-focus)
│                         │
│  CATEGORY               │
│  [🍜Food][🚌Transp]...  │  ← CategoryPicker
│                         │
│  NOTE                   │
│  [___________________]  │  ← TextInput
│                         │
│  DATE                   │
│  [📅 Wednesday, May 14] │
│                         │
│  [    Save Expense   ]  │  ← disabled nếu amount = 0
└─────────────────────────┘
```

Phần form được wrap trong `KeyboardAvoidingView` — trên iOS dùng `behavior='padding'`, Android dùng `'height'` để tránh keyboard che input.

### Validation

- Nút Save bị disable nếu `parsedCents === 0`
- `parsedCents = Math.round(parseFloat(amount || '0') * 100)`
- AmountInput chỉ cho phép nhập số và một dấu chấm thập phân

### Luồng lưu

```typescript
handleSave()
  1. id = Date.now().toString()
  2. permanentUri = await copyPhotoToStorage(tempUri, id)
  3. expense = { id, amount: parsedCents, category, note, date, photoUri: permanentUri, createdAt }
  4. await addExpense(expense)
  5. navigation.goBack()
```

### State

| State | Kiểu | Mô tả |
|---|---|---|
| `amount` | `string` | Chuỗi nhập từ bàn phím (VD: `"15.99"`) |
| `category` | `Category` | Danh mục đã chọn, mặc định `'Food'` |
| `note` | `string` | Ghi chú tuỳ chọn |
| `date` | `Date` | Ngày chi tiêu, mặc định hôm nay |
| `saving` | `boolean` | Đang lưu, disable nút |

---

## HistoryScreen — `src/screens/HistoryScreen.tsx`

Hiển thị toàn bộ lịch sử chi tiêu, nhóm theo ngày.

### Bố cục

```
┌─────────────────────────┐
│  TODAY              $xx │  ← section header với tổng ngày
│  [thumbnail] Food $5.00 │  ← ExpenseCard
│  [thumbnail] Food $3.50 │
│                         │
│  YESTERDAY         $xx  │
│  [thumbnail] Tran $12.0 │
│  ...                    │
└─────────────────────────┘
```

Empty state (khi chưa có chi tiêu):
```
        [📷 icon]
     No expenses yet
  Capture your first receipt
```

### Grouping logic

```typescript
// Map: date string → Expense[]
const map = new Map<string, Expense[]>();
for (const exp of expenses) {
  map.get(exp.date)?.push(exp) ?? map.set(exp.date, [exp]);
}

// Sort sections newest first
.sort(([a], [b]) => b.localeCompare(a))

// Section header labels
'2026-05-14' → 'Today'
'2026-05-13' → 'Yesterday'
'2026-05-01' → 'May 1, 2026'
```

### Refresh & Focus

```typescript
useFocusEffect(React.useCallback(() => { refresh(); }, [refresh]));
```

Tự động reload khi quay lại tab (sau khi thêm chi tiêu từ PreviewScreen).

Pull-to-refresh cũng gọi `refresh()`.

### Xoá chi tiêu

Nhấn nút `✕` trên `ExpenseCard` → `Alert.alert` xác nhận → `remove(id, photoUri)`.

`remove()` xoá cả record trong AsyncStorage lẫn file ảnh trên FileSystem.

---

## SummaryScreen — `src/screens/SummaryScreen.tsx`

Tổng hợp chi tiêu theo tháng với biểu đồ trực quan.

### Bố cục

```
┌─────────────────────────┐
│   [<]  May 2026  [>]    │  ← month selector
│                         │
│  ┌───────────────────┐  │
│  │   May 2026        │  │  ← SummaryCard
│  │   $248.50         │  │
│  │   total spent     │  │
│  └───────────────────┘  │
│                         │
│  SPENDING BY CATEGORY   │
│  [   Bar Chart    ]     │  ← MonthlyBarChart
│                         │
│  BREAKDOWN              │
│  [  Donut Chart   ]     │  ← CategoryPieChart
│  • Food      $120.00    │
│  • Transport  $48.50    │
│  ...                    │
└─────────────────────────┘
```

Khi không có chi tiêu trong tháng, hiển thị icon hoá đơn và text "No expenses recorded for this month."

### Month selector

- `[<]` → `subMonths(currentMonth, 1)` — không giới hạn, có thể xem bất kỳ tháng nào trong quá khứ
- `[>]` → `addMonths(currentMonth, 1)` — bị disable nếu đang ở tháng hiện tại (`isCurrentMonth`)

### Data flow

```
useExpenses() → expenses[]
                    ↓
useMonthlySummary(expenses, currentMonth) → MonthlySummary
                    ↓
SummaryCard      ← totalCents
MonthlyBarChart  ← byCategory
CategoryPieChart ← byCategory
```
