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

## Bước 2 — Khám phá codebase liên quan

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

## Bước 3 — Phân tích và soạn plan

Xác định rõ:
1. **Hiện trạng** — code đang làm gì, tại file nào, line nào
2. **Root cause / Lý do** — tại sao cần thay đổi (bug, deprecation, UX issue...)
3. **Approach** — cách fix cụ thể (không phải approach chung chung)
4. **Scope** — đúng các file nào cần sửa, không sửa file nào không cần thiết

## Bước 4 — Tạo file plan

```bash
mkdir -p plans/<slug>
```

Viết `plans/<slug>/plan.md` theo template bên dưới.

## Bước 5 — Report

In ra:
```
Plan đã tạo tại: plans/<slug>/plan.md
```

Tóm tắt 2-3 dòng về approach được chọn.

</process>

<plan-template>

```markdown
# Plan: {Tên task đầy đủ}

## AC
{Acceptance criteria — điều kiện "done" cụ thể, observable, không mơ hồ.
Viết dạng: "Khi X thì Y", hoặc "Component Z không còn dùng A"}

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

| File | Thay đổi |
|------|----------|
| `path/to/file.tsx` | {Mô tả ngắn — "Xóa import X, thêm hook Y"} |

{Nếu có file KHÔNG cần thay đổi dù trông có vẻ liên quan, note rõ lý do để tránh nhầm lẫn.}

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
</rules>
