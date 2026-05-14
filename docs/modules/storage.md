# Storage

Tầng lưu trữ gồm 2 module độc lập: một cho dữ liệu chi tiêu (AsyncStorage), một cho file ảnh (FileSystem).

---

## `src/storage/expenseStorage.ts`

Quản lý CRUD danh sách chi tiêu qua `@react-native-async-storage/async-storage`.

**Storage key:** `'@money_capture:expenses'`

Toàn bộ danh sách được lưu dưới dạng một JSON string duy nhất. Mỗi thao tác đều đọc → sửa → ghi lại toàn bộ mảng.

### `loadExpenses(): Promise<Expense[]>`

```typescript
const expenses = await loadExpenses();
// → [] nếu chưa có dữ liệu
// → Expense[] nếu đã có
```

Đọc và parse JSON từ AsyncStorage. Trả về mảng rỗng nếu key chưa tồn tại hoặc xảy ra lỗi parse.

### `addExpense(expense: Expense): Promise<Expense[]>`

```typescript
const updated = await addExpense(newExpense);
// → Danh sách mới nhất với expense vừa thêm ở đầu
```

Prepend expense mới vào đầu mảng (mới nhất trước). Trả về danh sách đã cập nhật.

### `deleteExpense(id: string): Promise<Expense[]>`

```typescript
const updated = await deleteExpense('1747200000000');
// → Danh sách sau khi xoá
```

Lọc bỏ expense có `id` tương ứng. Trả về danh sách đã cập nhật.

### Sơ đồ I/O

```
AsyncStorage key: '@money_capture:expenses'
         │
         │  JSON.stringify / JSON.parse
         │
     Expense[]
    (in memory)
```

---

## `src/storage/photoStorage.ts`

Quản lý file ảnh trong thư mục cố định của ứng dụng.

**Thư mục ảnh:** `{documentDirectory}/money-capture/photos/`

### Tại sao cần copy ảnh?

`expo-camera.takePictureAsync()` trả về URI trong **thư mục cache** của hệ điều hành. Cache có thể bị OS xoá bất kỳ lúc nào (khi thiết bị thiếu bộ nhớ, khi uninstall partial, v.v.). Để ảnh tồn tại lâu dài, phải copy sang `documentDirectory` trước khi lưu URI vào database.

```
TRƯỚC KHI LƯU:
  file:///data/user/0/.../cache/Camera/temp_abc.jpg   ← KHÔNG an toàn

SAU KHI COPY:
  file:///data/user/0/.../files/money-capture/photos/1747200000000.jpg  ← An toàn
```

### `ensurePhotoDir(): Promise<void>`

Tạo thư mục `money-capture/photos/` nếu chưa tồn tại. Được gọi tự động bởi `copyPhotoToStorage` — không cần gọi thủ công.

### `copyPhotoToStorage(tempUri: string, id: string): Promise<string>`

```typescript
const permanentUri = await copyPhotoToStorage(photo.uri, expense.id);
// tempUri:     'file:///...cache/Camera/temp_abc.jpg'
// permanentUri: 'file:///...files/money-capture/photos/1747200000000.jpg'
```

- Gọi `ensurePhotoDir()` để đảm bảo thư mục tồn tại
- Copy file từ `tempUri` sang `{PHOTO_DIR}/{id}.jpg`
- Trả về URI cố định — dùng làm `expense.photoUri`

### `deletePhoto(uri: string): Promise<void>`

```typescript
await deletePhoto(expense.photoUri);
```

Xoá file ảnh khỏi FileSystem. Được gọi khi xoá expense để tránh rác file. Tự động bỏ qua nếu file không tồn tại.

### Quy tắc đặt tên file

```
{expense.id}.jpg
```

`expense.id` = `Date.now().toString()` — đảm bảo unique và có thể lấy ra thời điểm tạo nếu cần.
