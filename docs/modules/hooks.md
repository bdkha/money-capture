# Custom Hooks

---

## `useExpenses` — `src/hooks/useExpenses.ts`

Hook trung tâm quản lý state danh sách chi tiêu. Bao gồm load, refresh và xoá.

### Trả về

```typescript
const { expenses, loading, refresh, remove } = useExpenses();
```

| Giá trị | Kiểu | Mô tả |
|---|---|---|
| `expenses` | `Expense[]` | Danh sách chi tiêu, sắp xếp mới nhất trước |
| `loading` | `boolean` | `true` trong khi đang đọc AsyncStorage |
| `refresh` | `() => Promise<void>` | Đọc lại toàn bộ từ storage, cập nhật state |
| `remove` | `(id, photoUri) => Promise<void>` | Xoá expense + file ảnh, cập nhật state |

### Vòng đời

```
mount → useEffect → refresh()
                    └─ setLoading(true)
                    └─ loadExpenses() ← AsyncStorage
                    └─ sort by createdAt desc
                    └─ setExpenses(sorted)
                    └─ setLoading(false)
```

### `refresh()`

Hàm được wrap trong `useCallback` (không có dependencies) — ổn định qua mọi render. Dùng được trực tiếp trong `useFocusEffect` mà không gây re-subscribe vô hạn.

```typescript
useFocusEffect(
  React.useCallback(() => { refresh(); }, [refresh])
);
```

### `remove(id, photoUri)`

```typescript
await remove('1747200000000', 'file:///...photos/1747200000000.jpg');
```

1. Gọi `deleteExpense(id)` → xoá khỏi AsyncStorage
2. Gọi `deletePhoto(photoUri)` → xoá file ảnh
3. Cập nhật state local (không cần load lại từ storage)

### Nơi sử dụng

- `HistoryScreen` — hiển thị danh sách và xử lý xoá
- `SummaryScreen` — lấy `expenses` để tính toán tổng tháng

---

## `useMonthlySummary` — `src/hooks/useMonthlySummary.ts`

Hook tính toán tổng chi tiêu theo tháng từ danh sách expenses có sẵn. Không thực hiện I/O — thuần tính toán, memoized với `useMemo`.

### Signature

```typescript
const summary = useMonthlySummary(expenses: Expense[], month: string): MonthlySummary
```

- `expenses` — danh sách từ `useExpenses()`
- `month` — chuỗi định dạng `'YYYY-MM'` (VD: `'2026-05'`)

### Thuật toán

```typescript
// Khởi tạo tất cả categories = 0
byCategory = { Food: 0, Transport: 0, ..., Other: 0 }

// Lọc và cộng dồn
for (expense of expenses) {
  if (expense.date.startsWith(month)) {
    byCategory[expense.category] += expense.amount
    totalCents += expense.amount
  }
}
```

Sử dụng `expense.date.startsWith(month)` để lọc theo tháng — đơn giản và hiệu quả nhờ định dạng ISO date `'YYYY-MM-DD'`.

### Memoization

```typescript
return useMemo(() => { ... }, [expenses, month]);
```

Chỉ tính lại khi `expenses` hoặc `month` thay đổi. Khi người dùng scroll trong SummaryScreen mà không đổi tháng, không có tính toán lại.

### Nơi sử dụng

`SummaryScreen` — truyền vào `SummaryCard`, `MonthlyBarChart`, `CategoryPieChart`.
