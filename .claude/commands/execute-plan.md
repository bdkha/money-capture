---
name: execute-plan
description: Thực thi một hoặc nhiều plan files song song, mark done sau khi hoàn thành
argument-hint: <slug-1> [slug-2] [slug-3] ...
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
---

<objective>
Đọc các plan files được chỉ định, thực thi các thay đổi code song song bằng
subagents (một agent per plan), sau đó mark mỗi plan là "done" bằng cách
append section kết quả vào plan.md.
</objective>

<process>

## Bước 1 — Parse và validate input

`$ARGUMENTS` là danh sách slugs hoặc paths, cách nhau bởi dấu cách.
Ví dụ: `hide-bottomtab-camera replace-safeareaview-camera`
Hoặc: `plans/hide-bottomtab-camera plans/replace-safeareaview-camera`

Với mỗi argument:
- Nếu bắt đầu bằng `plans/` → dùng nguyên
- Nếu không → thêm prefix `plans/`
- Kiểm tra file tồn tại:

```bash
ls plans/<slug>/plan.md 2>/dev/null || echo "NOT FOUND"
```

**Nếu không tìm thấy plan:** Báo lỗi rõ ràng và dừng.

## Bước 2 — Kiểm tra trạng thái

Với mỗi plan file, kiểm tra đã được executed chưa:

```bash
grep -l "## ✅ Kết quả" plans/<slug>/plan.md 2>/dev/null
```

- Nếu đã có `## ✅ Kết quả` → cảnh báo user plan này đã done, hỏi có muốn
  re-execute không. Nếu user không confirm, bỏ qua plan đó.
- Nếu chưa có → tiếp tục.

## Bước 3 — Phát hiện conflict (optional warning)

Với mỗi plan, extract danh sách files sẽ bị thay đổi từ section `## Scope`:

```bash
grep "^\| \`" plans/<slug>/plan.md | sed "s/.*\`\(.*\)\`.*/\1/"
```

Nếu 2 plans khác nhau cùng thay đổi 1 file → cảnh báo:
```
⚠️ Conflict tiềm ẩn: plans/A và plans/B cùng sửa src/foo/Bar.tsx
   Sẽ chạy tuần tự thay vì song song để tránh race condition.
```
Trong trường hợp đó chạy các plan conflict tuần tự, các plan không conflict
vẫn chạy song song.

## Bước 4 — Đọc tất cả plan files

Đọc nội dung đầy đủ của từng `plans/<slug>/plan.md` trước khi spawn agents.
Đây là thông tin duy nhất agent cần — đừng để agent tự đi tìm plan file.

## Bước 5 — Spawn subagents song song

**QUAN TRỌNG:** Spawn TẤT CẢ agents (không conflict) trong MỘT lần gọi
tool duy nhất để chúng thực sự chạy song song.

Với mỗi plan, spawn một Agent với prompt theo template sau:

```
Thực thi plan dưới đây bằng cách áp dụng chính xác các thay đổi được mô tả.

## Plan content

{nội dung đầy đủ của plans/<slug>/plan.md}

## Hướng dẫn thực thi

1. Đọc từng file trong section "## Thay đổi cần làm" TRƯỚC khi edit
2. Dùng Edit tool cho thay đổi nhỏ/targeted (preferred) — chỉ dùng Write khi tạo file mới
3. Thực hiện ĐÚNG theo plan — không refactor thêm, không cleanup ngoài scope
4. Nếu code hiện tại khác với "Hiện trạng" trong plan (file đã bị sửa), hãy
   adapt thay đổi cho phù hợp với state hiện tại thay vì báo lỗi
5. Sau khi xong, trả về danh sách files đã thay đổi và tóm tắt ngắn mỗi file

## Output format (bắt buộc)

Kết thúc response bằng block sau (để orchestrator parse):
---RESULT---
files: <file1>, <file2>, ...
summary: <1-2 câu tóm tắt những gì đã làm>
---END---
```

## Bước 6 — Thu thập kết quả và mark done

Sau khi tất cả agents hoàn thành, với mỗi plan:

1. Parse `---RESULT---` block từ agent output để lấy `files` và `summary`
2. Lấy timestamp hiện tại:

```bash
date "+%Y-%m-%d %H:%M"
```

3. Append section done vào `plans/<slug>/plan.md`:

```markdown


---

## ✅ Kết quả

**Executed:** {timestamp}
**Files đã thay đổi:**
{danh sách files, mỗi file 1 dòng bắt đầu bằng - }

**Tóm tắt:** {summary từ agent}
```

## Bước 7 — Report tổng kết

In ra bảng kết quả:

```
## Kết quả Execute

| Plan | Status | Files thay đổi |
|------|--------|----------------|
| hide-bottomtab-camera | ✅ Done | GlassBottomNav.tsx |
| replace-safeareaview-camera | ✅ Done | CameraScreen.tsx |

Tổng: 2 plans thực thi thành công.
```

Nếu có plan nào thất bại, hiển thị lỗi cụ thể và **không** mark done cho plan đó.

</process>

<agent-execution-rules>
Các rules này apply cho subagent thực thi plan:

- **Đọc trước khi sửa** — luôn Read file trước khi Edit, dù plan đã có snippet
- **Targeted edits** — dùng Edit với `old_string`/`new_string` chính xác thay vì Write cả file
- **Không thêm ngoài scope** — không fix linting, không rename variable, không thêm comment
- **Adapt nếu cần** — nếu line number trong plan lệch do file đã bị sửa trước đó,
  tìm đúng đoạn code bằng nội dung (không phải line number) và apply thay đổi
- **Không hỏi** — plan đã đủ thông tin, execute trực tiếp không confirm thêm
- **Báo cáo chính xác** — chỉ list files thực sự đã thay đổi trong `---RESULT---`
</agent-execution-rules>

<rules>
- Nếu `$ARGUMENTS` rỗng → hiển thị danh sách plans available: `ls plans/`
- Tối đa 5 plans trong 1 lần execute — nếu nhiều hơn, gợi ý chia thành nhiều lần
- Không commit code sau khi execute — để user review trước
- Không xóa plan files sau khi done — chỉ append section kết quả
- Plans đã có `## ✅ Kết quả` được coi là done — không re-execute trừ khi user confirm
</rules>
