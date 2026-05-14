# money-capture

Ứng dụng mobile ghi lại chi tiêu cá nhân, lấy cảm hứng từ UX của **Locket** — màn hình chính là camera toàn màn hình, người dùng chụp ảnh hoá đơn/biên lai rồi nhập thông tin chi tiêu ngay sau đó.

## Tài liệu

| Tài liệu | Mô tả |
|---|---|
| [Bắt đầu nhanh](./getting-started.md) | Cài đặt, chạy thử, cấu hình |
| [Kiến trúc](./architecture.md) | Cấu trúc thư mục, luồng dữ liệu, quyết định thiết kế |
| [Màn hình (Screens)](./modules/screens.md) | Chi tiết từng màn hình |
| [Component](./modules/components.md) | Tài liệu từng UI component |
| [Hooks](./modules/hooks.md) | Custom hooks và logic tái sử dụng |
| [Lưu trữ (Storage)](./modules/storage.md) | Cách dữ liệu và ảnh được lưu trữ |
| [Kiểu dữ liệu & Theme](./modules/types-and-theme.md) | Data model, hệ màu, typography |
| [Navigation](./modules/navigation.md) | Cấu trúc điều hướng |
| [Build & CI/CD](./build.md) | Build APK, GitHub Actions, EAS |

## Tổng quan tính năng

```
Mở app → Camera toàn màn hình
         ↓ Nhấn nút chụp
         Xem trước ảnh + điền thông tin
         (số tiền · danh mục · ghi chú · ngày)
         ↓ Lưu
         ┌─────────────────────────────┐
         │  Tab Camera  │  Tab History │  Tab Summary  │
         └─────────────────────────────┘
```

- **Camera** — chụp ảnh hoá đơn ngay khi mở app
- **History** — danh sách chi tiêu theo ngày, kéo để xoá
- **Summary** — tổng chi tiêu theo tháng, biểu đồ cột và donut theo danh mục

## Stack kỹ thuật

| Thành phần | Thư viện |
|---|---|
| Framework | Expo SDK 54 + React Native 0.81 |
| Ngôn ngữ | TypeScript 5.9 |
| Điều hướng | React Navigation 7 (Stack + BottomTabs) |
| Camera | expo-camera v55 (`CameraView`) |
| Lưu trữ chi tiêu | `@react-native-async-storage/async-storage` |
| Lưu trữ ảnh | `expo-file-system/legacy` (documentDirectory) |
| Biểu đồ | Victory Native v41 + `@shopify/react-native-skia` |
| Animation | `react-native-reanimated` v4 |
| Gesture | `react-native-gesture-handler` v2 |
| Tiện ích ngày | `date-fns` v4 |
| Rung phản hồi | `expo-haptics` |
