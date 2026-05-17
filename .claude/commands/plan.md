---
name: plan
description: Tạo file plan cho một task trong thư mục plans/{slug}/plan.md
argument-hint: <mô tả task ngắn gọn>
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Phân tích codebase để hiểu hiện trạng, sau đó tạo một plan file chi tiết tại
`plans/{slug}/plan.md` cho task được mô tả trong `$ARGUMENTS`.

Plan phải đủ chi tiết để một developer (hoặc subagent) có thể thực hiện mà
không cần đặt thêm câu hỏi — bao gồm file path, line number, và code snippet
cụ thể.
</objective>

<process>

## Bước 1 — Tạo slug từ task description

Chuyển `$ARGUMENTS` thành kebab-case slug (lowercase, dấu cách → `-`, bỏ ký
tự đặc biệt). Ví dụ:
- "Ẩn bottom tab màn hình camera" → `an-bottom-tab-camera`
- "Fix crash khi mở profile" → `fix-crash-mo-profile`

```bash
# Kiểm tra slug chưa tồn tại
ls plans/ 2>/dev/null || echo "plans dir empty"
```

## Bước 2 — Tư duy trước khi code

Trước khi đọc code, ghi rõ (chỉ trong đầu, không cần output):

1. **Assumptions** — những gì mình giả định về task (platform, lib version, behavior). Nếu assumption sai → plan sai.
2. **Unknowns** — điều gì chưa rõ có thể đổi hướng approach? Nếu có unknown nghiêm trọng → hỏi user trước, đừng plan dựa trên guess.
3. **Simplest approach** — cách đơn giản nhất để đạt AC là gì? Không thêm abstraction, không "tương lai-proof" nếu không cần.
4. **Tradeoffs** — nếu approach đơn giản nhất có vấn đề (edge case, performance, breaking change), ghi lý do chọn approach khác vào plan.

> Nếu sau bước này vẫn còn unknown nghiêm trọng → **dừng lại, hỏi user**, đừng tiếp tục.

## Bước 3 — Khám phá codebase liên quan

Dựa vào từ khóa trong task, tìm các file liên quan:

```bash
# Tìm file theo keyword
grep -r "<keyword>" src/ --include="*.tsx" --include="*.ts" -l

# Đọc file navigation nếu task liên quan đến routing
# Đọc screen file nếu task liên quan đến UI
# Đọc component file nếu task liên quan đến component cụ thể
```

Đọc **toàn bộ** các file liên quan trực tiếp đến task — không đọc file không
liên quan. Ghi nhớ:
- File path chính xác
- Line number của code cần thay đổi
- Dependencies (import, hooks, props) liên quan

## Bước 4 — Phân tích và soạn plan

Xác định rõ:
1. **Hiện trạng** — code đang làm gì, tại file nào, line nào
2. **Root cause / Lý do** — tại sao cần thay đổi (bug, deprecation, UX issue...)
3. **Approach** — cách fix cụ thể (không phải approach chung chung)
4. **Scope** — đúng các file nào cần sửa, không sửa file nào không cần thiết

## Bước 5 — Tạo file plan

```bash
mkdir -p plans/<slug>
```

Viết `plans/<slug>/plan.md` theo template bên dưới.

## Bước 6 — Report

In ra:
```
Plan đã tạo tại: plans/<slug>/plan.md
```

Tóm tắt 2-3 dòng về approach được chọn.

</process>

<plan-template>

```markdown
# Plan: {Tên task đầy đủ}

## AC (Acceptance Criteria)

{Mỗi criterion phải observable và testable — có cách kiểm tra cụ thể khi chạy app hoặc đọc code.

✅ Tốt: "Bottom tab không hiển thị khi navigate đến CameraScreen"
❌ Tệ: "UX tốt hơn" / "Code sạch hơn"

Viết dạng: "Khi X thì Y", hoặc "File Z không còn import A"}

## Verification

{Ghi cụ thể cách kiểm tra từng AC ở trên:
- Chạy lệnh nào? Navigate đến màn hình nào? Đọc file nào?
- Ví dụ: "Mở app → Camera tab → bottom tab không hiển thị"
- Ví dụ: "grep -r 'SafeAreaView' src/modules/camera — không có kết quả"}

## Hiện trạng

{Mô tả chính xác code hiện tại — file path, line number, snippet liên quan.
Ví dụ:
- `src/modules/camera/screens/CameraScreen.tsx` line 7: import `SafeAreaView` từ `react-native`
- Line 327: `<SafeAreaView style={styles.topOverlay}>` bao top overlay}

## Root cause / Lý do

{Giải thích tại sao đây là vấn đề — bug, deprecation, design decision, performance...
Không viết chung chung, phải specific với code này.}

## Thay đổi cần làm

### File: `{path/to/file.tsx}`

{Mô tả thay đổi với before/after code snippet. Chỉ include code thực sự thay đổi, không paste nguyên file.}

**Trước:**
```tsx
{code cũ}
```

**Sau:**
```tsx
{code mới}
```

{Nếu có nhiều file, lặp lại section "### File:" cho mỗi file}

## Scope

**Files thay đổi:**

| File | Thay đổi |
|------|----------|
| `path/to/file.tsx` | {Mô tả ngắn — "Xóa import X, thêm hook Y"} |

**Files KHÔNG thay đổi** (dù trông có vẻ liên quan):

| File | Lý do bỏ qua |
|------|--------------|
| `path/to/other.tsx` | {Lý do — "chỉ re-export, không chứa logic cần sửa"} |

## Lưu ý / Caveats

{Optional — chỉ viết nếu có edge case, gotcha, hoặc quyết định thiết kế cần giải thích.
Xóa section này nếu không có gì đặc biệt.}
```

</plan-template>

<rules>
- Slug phải unique trong `plans/` — nếu đã tồn tại, thêm suffix `-2`, `-3`...
- Line number trong plan phải chính xác (đọc file thực tế, không ước đoán)
- Code snippet chỉ include phần thay đổi + đủ context để locate (không paste nguyên file)
- "Thay đổi cần làm" phải đủ chi tiết để execute mà không cần đọc thêm file
- Không tạo plan cho task quá lớn (nhiều hơn ~5 file) — gợi ý user chia nhỏ thành nhiều task
- Viết bằng tiếng Việt, code snippet giữ nguyên tiếng Anh
- Không thực thi plan — chỉ tạo file plan
- **Think first**: nếu còn unknown nghiêm trọng sau Bước 2, hỏi user trước khi tiếp tục
- **Simplicity first**: chọn approach đơn giản nhất đáp ứng AC — nếu phức tạp hơn, ghi lý do trong plan
- **Surgical**: mỗi file trong Scope phải có lý do rõ ràng — nếu không chắc file đó cần sửa, mặc định KHÔNG sửa
- **AC phải testable**: mỗi criterion có cách verify cụ thể, ghi trong section "Verification"
</rules>
