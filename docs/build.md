# Build & CI/CD

## Chạy development

```bash
npm start          # Expo dev server (scan QR bằng Expo Go)
npm run android    # Mở trực tiếp trên Android emulator
npm run ios        # Mở trực tiếp trên iOS Simulator (macOS)
```

---

## Build APK với EAS

[EAS Build](https://docs.expo.dev/build/introduction/) là dịch vụ build cloud của Expo — không cần cài Android SDK hay Java trên máy cá nhân.

### Cài đặt một lần (local)

```bash
# Cài EAS CLI
npm install -g eas-cli

# Đăng nhập Expo
eas login

# Đăng ký project (sinh projectId vào app.json)
eas init
```

### Build APK thủ công

```bash
# Release APK (production-signed)
eas build --platform android --profile release

# Preview APK (internal, không cần keystore chính thức)
eas build --platform android --profile preview
```

Sau khi build xong, EAS trả về link download APK trực tiếp.

### Build profiles (`eas.json`)

| Profile | `buildType` | Mục đích |
|---|---|---|
| `development` | dev client | Debug với custom native modules |
| `preview` | `apk` | Test nội bộ, không cần Play Store |
| `release` | `apk` | Phát hành chính thức |

---

## CI/CD — GitHub Actions

File: `.github/workflows/build-apk.yml`

### Trigger

| Sự kiện | Điều kiện | Profile |
|---|---|---|
| Push tag | `v*` (VD: `v1.0.0`) | `release` |
| Manual | Workflow dispatch | `release` hoặc `preview` (chọn được) |

### Các bước trong workflow

```
1. checkout
2. setup-node@v4 (Node 20, cache npm)
3. npm ci
4. expo/expo-github-action@v8  ← cài Expo CLI + EAS CLI
5. eas build --platform android --profile {profile} --non-interactive --wait
6. In APK download URL vào GitHub Step Summary
```

### Setup secrets

Vào **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Giá trị |
|---|---|
| `EXPO_TOKEN` | Token từ expo.dev → Account Settings → Access Tokens |

### Tạo release build từ tag

```bash
git tag v1.0.0
git push origin v1.0.0
# → GitHub Actions tự động build và cung cấp link download APK
```

### Xem kết quả build

1. GitHub → tab **Actions**
2. Chọn workflow run tương ứng
3. Cuộn xuống phần **Summary** → link download APK

---

## Babel config

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],  // PHẢI là plugin cuối cùng
  };
};
```

`react-native-reanimated/plugin` **bắt buộc phải nằm cuối** danh sách plugins — yêu cầu của thư viện Reanimated và Victory Native v41.
