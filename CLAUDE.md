# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Expo dev server — scan QR with Expo Go
npm run android     # Run on Android emulator / device
npm run ios         # Run on iOS Simulator (macOS only)
```

No test runner is configured. TypeScript is checked via the compiler only — there is no separate `tsc` script, but type errors surface at build time.

```bash
# EAS cloud builds (requires eas-cli and EXPO_TOKEN)
eas build --platform android --profile preview   # APK for internal testing
eas build --platform android --profile release   # Production APK
```

## Architecture

**Feature-first** structure under `src/modules/`. No global state manager — each module manages its own state via custom hooks that wrap SQLite calls.

```
App.tsx
└── ThemeProvider + I18nProvider + NavigationContainer
    └── RootNavigator (Stack)
        ├── Tabs (BottomTabNavigator) — Feed, Stats, Camera, Budget, Profile
        ├── Preview (slide_from_bottom) — review photo + enter expense
        └── Settings (slide_from_right)
```

**Module layout** (each module under `src/modules/<name>/`):
- `screens/` — full-screen components
- `components/` — module-specific UI pieces
- `hooks/` — business logic (load/mutate data)
- `storage/` — SQLite queries

**Shared layer** (`src/shared/`):
- `database/db.ts` — single SQLite connection, schema migration on import
- `types/index.ts` — `Expense`, `Category`, `AppCategory`, `Mood`, `MonthBudget`
- `theme/index.ts` — `Colors`, `Spacing`, `Radii`, `Typography`, `FontNames` (static, light-mode only)
- `theme/ThemeContext.tsx` — `useColors()` / `useTheme()` for dynamic light/dark tokens
- `i18n/I18nContext.tsx` — `useI18n()` returns `{ t, language, setLanguage }`
- `navigation/RootNavigator.tsx` — defines `TabParamList` and `RootStackParamList`

## Key conventions

**Money is always stored as whole VND integers.** `Expense.amount` is raw đồng (e.g. `25000`). Use `formatVND()` from `src/shared/utils/currency.ts` for display.

**Database is synchronous via `expo-sqlite` sync API.** `db.runSync`, `db.getAllSync`, `db.getFirstSync` — no `await` needed inside storage functions. Schema migration runs once at module import in `db.ts` via `PRAGMA user_version`.

**Photos must be copied out of cache.** `expo-camera` writes to the OS cache which can be cleared at any time. Call `copyPhotoToStorage(tempUri, id)` (in `src/modules/camera/storage/photoStorage.ts`) before persisting an `Expense`. The resulting URI points to `documentDirectory` and is safe to store.

**Bottom tab is hidden on CameraScreen** via `tabBarStyle: { display: 'none' }` in `RootNavigator.tsx`. PreviewScreen hides it automatically because it is a Stack screen, not a Tab screen.

**Screens refresh on focus.** History, Feed, Stats, and Budget screens use `useFocusEffect` to reload data when the user returns to the tab, ensuring they reflect changes made in PreviewScreen.

**Theme tokens.** For any screen that supports dark mode, use `useColors()` instead of importing `Colors` directly from `src/shared/theme/index.ts`. The static `Colors` export only covers light-mode values.

**i18n.** UI strings come from `useI18n().t`. Category display names for built-in categories use i18n keys (`cafe`, `food`, `shopping`, `transport`, `entertainment`, `home`). Custom categories store their display name directly in `AppCategory.key`.

## Plans

Task plans are stored in `plans/<slug>/plan.md`. Run `/plan` to create a new plan before implementing a non-trivial task.

## CI/CD

GitHub Actions (`.github/workflows/build-apk.yml`) builds an APK via EAS on push of a `v*` tag or manual dispatch. Requires `EXPO_TOKEN` secret in the repo. The `react-native-reanimated/plugin` in `babel.config.js` must remain the last Babel plugin — required by Reanimated and Victory Native.
