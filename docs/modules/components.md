# Components

Tất cả component trong `src/components/` đều là **pure presentational** — không truy cập storage, không dùng navigation trực tiếp (trừ khi được truyền callback).

---

## ShutterButton — `src/components/ShutterButton.tsx`

Nút chụp ảnh tròn với animation spring khi nhấn.

### Props

```typescript
interface ShutterButtonProps {
  onPress: () => void;
  disabled?: boolean;  // mặc định false
}
```

### Thiết kế

```
   ╭────────────╮
  │  ╭────────╮  │  ← outer ring: 80px, border trắng 60% opacity
  │  │        │  │
  │  │  fill  │  │  ← inner circle: 64px, trắng đặc
  │  │        │  │
  │  ╰────────╯  │
   ╰────────────╯
```

### Animation

Dùng `Animated.Value` (không phải Reanimated) để đơn giản:
- `onPressIn` → `Animated.spring` scale về `0.88`, speed `30`
- `onPressOut` → `Animated.spring` scale về `1.0`, speed `20`
- `disabled=true` → opacity `0.4`, không nhận touch

---

## AmountInput — `src/components/AmountInput.tsx`

Ô nhập số tiền lớn với ký hiệu tiền tệ.

### Props

```typescript
interface AmountInputProps {
  value: string;           // chuỗi raw từ TextInput ('15.99', '0', '')
  onChange: (val: string) => void;
}
```

### Bố cục

```
   $   [   15.99   ]
  ↑       ↑
 grey   48px bold, center
```

### Validation nội bộ

Input được sanitize khi nhập:
```typescript
text.replace(/[^0-9.]/g, '')     // chỉ giữ số và dấu chấm
    .replace(/(\..*)\./g, '$1')  // tối đa 1 dấu chấm thập phân
```

Keyboard type: `decimal-pad` (không có ký tự đặc biệt).
`autoFocus` bật sẵn — bàn phím hiện ngay khi PreviewScreen mở.

---

## CategoryPill — `src/components/CategoryPill.tsx`

Badge danh mục đơn lẻ, dạng pill (viên thuốc).

### Props

```typescript
interface CategoryPillProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}
```

### Visual states

| State | Background | Border | Text |
|---|---|---|---|
| Selected | màu danh mục | màu danh mục | đen `#000` |
| Unselected | `Colors.surface` | `Colors.border` | `Colors.textSecondary` |

### Emoji theo danh mục

| Danh mục | Emoji |
|---|---|
| Food | 🍜 |
| Transport | 🚌 |
| Shopping | 🛍 |
| Bills | 📄 |
| Entertainment | 🎬 |
| Health | 💊 |
| Other | 📦 |

---

## CategoryPicker — `src/components/CategoryPicker.tsx`

Thanh chọn danh mục — horizontal ScrollView chứa tất cả `CategoryPill`.

### Props

```typescript
interface CategoryPickerProps {
  selected: Category;
  onChange: (category: Category) => void;
}
```

Render tất cả 7 category từ `CATEGORIES` constant. `showsHorizontalScrollIndicator={false}` để giao diện gọn.

---

## ExpenseCard — `src/components/ExpenseCard.tsx`

Card hiển thị một chi tiêu trong danh sách History.

### Props

```typescript
interface ExpenseCardProps {
  expense: Expense;
  onDelete: () => void;
}
```

### Bố cục

```
┌──────────────────────────────────────────┐
│ [thumb] ● Food        Bún bò        $5.00 ✕ │
│  48px   dot  category  note(1line)  accent   │
└──────────────────────────────────────────┘
```

- **Thumbnail**: ảnh 48×48, `borderRadius: Radii.sm`, fallback màu `Colors.surfaceHigh`
- **Category dot**: chấm tròn 8px màu `Colors.categories[category]`
- **Note**: `numberOfLines={1}` — truncate nếu quá dài
- **Amount**: màu `Colors.accent` (vàng)
- **Nút xoá** (`✕`): `hitSlop={8}` để dễ bấm hơn

---

## SummaryCard — `src/components/SummaryCard.tsx`

Card hiển thị tổng chi tiêu của một tháng.

### Props

```typescript
interface SummaryCardProps {
  totalCents: number;  // tổng cents của tháng
  month: string;       // 'YYYY-MM'
}
```

### Bố cục

```
┌───────────────────────┐
│      MAY 2026         │  ← month label (uppercase)
│      $248.50          │  ← total (44px, accent)
│      total spent      │  ← subtitle
└───────────────────────┘
```

---

## MonthlyBarChart — `src/components/MonthlyBarChart.tsx`

Biểu đồ cột hiển thị chi tiêu theo danh mục trong tháng.

### Props

```typescript
interface MonthlyBarChartProps {
  summary: MonthlySummary;
}
```

### Thư viện

Dùng `CartesianChart` + `Bar` từ **Victory Native v41** (Skia-accelerated).

### Data transform

```typescript
// Chỉ hiển thị danh mục có chi tiêu > 0
const data = Object.entries(summary.byCategory)
  .filter(([, cents]) => cents > 0)
  .map(([category, cents]) => ({
    category: category.substring(0, 5),  // label ngắn: 'Food', 'Trans', 'Shopp'...
    amount: Math.round(cents / 100),     // dollars (số nguyên để trục Y gọn)
    color: Colors.categories[category],
  }));
```

Mỗi bar có màu riêng theo danh mục. Corners bo tròn `topLeft: 4, topRight: 4`.

Hiển thị empty state `'No data this month'` nếu `data.length === 0`.

---

## CategoryPieChart — `src/components/CategoryPieChart.tsx`

Biểu đồ donut và legend chi tiết theo danh mục.

### Props

```typescript
interface CategoryPieChartProps {
  summary: MonthlySummary;
}
```

### Thư viện

Dùng `PolarChart` + `Pie.Chart` + `Pie.Slice` từ **Victory Native v41**.

```typescript
<PolarChart data={slices} colorKey="color" valueKey="value" labelKey="label">
  <Pie.Chart innerRadius="50%">
    {() => <Pie.Slice />}
  </Pie.Chart>
</PolarChart>
```

`innerRadius="50%"` tạo hình donut (ring) thay vì bánh tròn đặc.

### Legend

Bên dưới biểu đồ là legend dạng list:

```
● Food          $120.00
● Transport      $48.50
● Shopping       $40.00
```

Màu dot, tên danh mục, số tiền format `$xx.xx`.

Trả về `null` nếu không có danh mục nào có chi tiêu.
