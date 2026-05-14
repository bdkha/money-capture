# Bắt đầu nhanh

## Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Node.js | 20+ |
| npm | 9+ |
| Expo Go (trên thiết bị) | Mới nhất |
| Android Studio / Xcode | Tuỳ chọn — chỉ cần khi build native |

## Cài đặt

```bash
# Clone repo
git clone https://github.com/bdkha/money-capture.git
cd money-capture

# Cài dependencies
npm install
```

## Chạy ứng dụng

```bash
# Khởi động Expo dev server
npm start
# hoặc
npx expo start
```

Sau đó:
- **Android**: Quét QR bằng app **Expo Go**, hoặc nhấn `a` để mở Android emulator
- **iOS**: Quét QR bằng Camera app (iOS 16+), hoặc nhấn `i` để mở iOS Simulator

```bash
# Chạy trực tiếp trên Android
npm run android

# Chạy trực tiếp trên iOS
npm run ios
```

## Cấu trúc thư mục

```
money-capture/
├── App.tsx                     # Entry point
├── app.json                    # Expo config (tên app, permissions, plugins)
├── eas.json                    # EAS Build profiles
├── babel.config.js             # Babel config (reanimated plugin)
├── tsconfig.json               # TypeScript config
├── assets/                     # Icon, splash screen
├── docs/                       # Tài liệu dự án (thư mục này)
├── .github/
│   └── workflows/
│       └── build-apk.yml       # CI/CD tự động build APK
└── src/
    ├── types/index.ts          # Data model (Expense, Category, ...)
    ├── theme/index.ts          # Colors, Spacing, Typography
    ├── storage/
    │   ├── expenseStorage.ts   # CRUD chi tiêu (AsyncStorage)
    │   └── photoStorage.ts     # Quản lý file ảnh (FileSystem)
    ├── hooks/
    │   ├── useExpenses.ts      # State management chi tiêu
    │   └── useMonthlySummary.ts # Tính toán tổng theo tháng
    ├── navigation/
    │   └── RootNavigator.tsx   # Stack + BottomTab navigator
    ├── screens/
    │   ├── CameraScreen.tsx    # Màn hình chính — camera
    │   ├── PreviewScreen.tsx   # Xem ảnh + nhập thông tin
    │   ├── HistoryScreen.tsx   # Lịch sử chi tiêu
    │   └── SummaryScreen.tsx   # Tổng hợp & biểu đồ
    └── components/
        ├── ShutterButton.tsx   # Nút chụp ảnh có animation
        ├── AmountInput.tsx     # Ô nhập số tiền
        ├── CategoryPill.tsx    # Badge danh mục đơn lẻ
        ├── CategoryPicker.tsx  # Thanh chọn danh mục
        ├── ExpenseCard.tsx     # Card hiển thị 1 chi tiêu
        ├── SummaryCard.tsx     # Card tổng tiền tháng
        ├── MonthlyBarChart.tsx # Biểu đồ cột theo danh mục
        └── CategoryPieChart.tsx# Biểu đồ donut + legend
```

## Quyền (Permissions)

Ứng dụng yêu cầu 2 quyền trên thiết bị:

| Quyền | Mục đích |
|---|---|
| Camera | Chụp ảnh hoá đơn/biên lai |
| Media Library | Lưu ảnh vào bộ nhớ thiết bị |

Cả hai quyền đều được khai báo trong `app.json` qua plugin `expo-camera` và `expo-media-library`. Hộp thoại xin quyền xuất hiện lần đầu khi mở tab Camera.

## Biến môi trường & Secrets

Ứng dụng không dùng biến môi trường runtime. Secrets chỉ cần thiết khi dùng CI/CD:

| Secret | Nơi đặt | Mục đích |
|---|---|---|
| `EXPO_TOKEN` | GitHub repo → Settings → Secrets | Xác thực với EAS Build |

Xem thêm: [Build & CI/CD](./build.md)
