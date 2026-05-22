# Types & Theme

## `src/types/index.ts`

Định nghĩa toàn bộ data model của ứng dụng. Không import từ bất kỳ module nào khác trong dự án.

### `Category`

```typescript
type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Other';
```

Union type liệt kê 7 danh mục chi tiêu. Dùng làm key trong `Colors.categories` và `MonthlySummary.byCategory`.

### `CATEGORIES`

```typescript
const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
```

Mảng hằng số chứa tất cả danh mục theo thứ tự hiển thị. Dùng để render `CategoryPicker` và khởi tạo `byCategory` trong `useMonthlySummary`.

### `Expense`

```typescript
interface Expense {
  id: string;        // Date.now().toString() — unique, có thể sort theo thời gian tạo
  amount: number;    // Số nguyên, đơn vị cents (VD: 1599 = $15.99)
  category: Category;
  note: string;      // Chuỗi rỗng nếu không có ghi chú
  date: string;      // Định dạng 'YYYY-MM-DD' (VD: '2026-05-14')
  photoUri: string;  // URI tuyệt đối trong documentDirectory
  createdAt: string; // ISO 8601 timestamp (VD: '2026-05-14T11:30:00.000Z')
}
```

**Lưu ý quan trọng:**
- `amount` luôn là **cents** (số nguyên). Khi hiển thị: `(amount / 100).toFixed(2)`
- `date` là ngày chi tiêu (do người dùng chọn), `createdAt` là thời điểm lưu vào app — hai giá trị này có thể khác nhau
- `photoUri` phải trỏ đến `documentDirectory`, không được trỏ đến cache

### `MonthlySummary`

```typescript
interface MonthlySummary {
  month: string;                         // 'YYYY-MM' (VD: '2026-05')
  totalCents: number;                    // Tổng tất cả chi tiêu trong tháng (cents)
  byCategory: Record<Category, number>;  // Cents theo từng danh mục
}
```

Kết quả trả về từ hook `useMonthlySummary`. Luôn có đầy đủ 7 key trong `byCategory` (danh mục không có chi tiêu = 0).

---

## `src/theme/index.ts`

Hệ thống design token của ứng dụng. Import `Category` từ `src/types`.

### `Colors`

```typescript
const Colors = {
  background:    '#0A0A0A',  // Nền tổng thể (gần đen)
  surface:       '#1A1A1A',  // Card, modal, input background
  surfaceHigh:   '#2A2A2A',  // Element được nâng cao
  accent:        '#F5C542',  // Màu chủ đạo — vàng ấm (số tiền, nút Save, active tab)
  accentMuted:   '#8A7A2A',  // Accent mờ (ít dùng)
  text:          '#FFFFFF',  // Text chính
  textSecondary: '#9A9A9A',  // Text phụ, placeholder, label
  border:        '#2E2E2E',  // Viền card, divider
  danger:        '#FF4444',  // Màu xoá/lỗi

  categories: {              // Màu riêng cho từng danh mục
    Food:          '#FF6B6B',
    Transport:     '#4ECDC4',
    Shopping:      '#A78BFA',
    Bills:         '#F59E0B',
    Entertainment: '#EC4899',
    Health:        '#10B981',
    Other:         '#6B7280',
  } as Record<Category, string>,
};
```

### `Spacing`

Scale khoảng cách 8pt:

| Token | Giá trị | Dùng cho |
|---|---|---|
| `xs` | 4px | Gap nhỏ trong component |
| `sm` | 8px | Padding nội bộ component |
| `md` | 16px | Padding nội dung chính |
| `lg` | 24px | Margin ngang màn hình |
| `xl` | 32px | Padding section |
| `xxl` | 48px | Khoảng cách lớn |

### `Radii`

```typescript
const Radii = { sm: 6, md: 12, lg: 20, full: 9999 };
```

`full: 9999` dùng cho pill/badge hình viên thuốc và nút tròn.

### `Typography`

```typescript
const Typography = {
  hero:    { fontSize: 36, fontWeight: '700' },  // Tiêu đề lớn
  title:   { fontSize: 22, fontWeight: '700' },  // Tiêu đề màn hình
  body:    { fontSize: 16, fontWeight: '400' },  // Văn bản thường
  caption: { fontSize: 13, fontWeight: '400' },  // Chú thích nhỏ
  amount:  { fontSize: 48, fontWeight: '800' },  // Hiển thị số tiền lớn
};
```
