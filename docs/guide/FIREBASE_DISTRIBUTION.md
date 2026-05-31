# Build iOS & Android → Firebase App Distribution

This repo builds the **money-cat** Expo app for both platforms on **EAS Cloud**
and uploads the artifacts to **Firebase App Distribution** via GitHub Actions.

- Workflow: [`.github/workflows/firebase-distribution.yml`](../../.github/workflows/firebase-distribution.yml)
- EAS build profile: `firebase` in [`eas.json`](../../eas.json)
  - Android → `.apk` (installable directly by testers)
  - iOS → `.ipa` (ad-hoc / internal distribution)

## How it runs

- **Manually**: GitHub → *Actions* → *Build & Firebase Distribution* → *Run workflow*.
  Choose the platform (`all` / `android` / `ios`) and the EAS profile.
- **Automatically**: on every push to `main`.

Each job:
1. `eas build --platform <p> --profile firebase --wait --json` (build on EAS Cloud)
2. Downloads the resulting artifact (`applicationArchiveUrl`)
3. Uploads it to Firebase App Distribution

## Configuration you need to add (the config files "tôi sẽ thêm sau")

Add these under **Settings → Secrets and variables → Actions**.

### Repository secrets

| Secret | What it is | Where to get it |
| --- | --- | --- |
| `EXPO_TOKEN` | Expo access token used by EAS CLI | https://expo.dev → Account → *Access Tokens* |
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON of a service account with the *Firebase App Distribution Admin* role | Google Cloud Console → IAM → Service Accounts → *Keys* → *Add key (JSON)* |
| `FIREBASE_ANDROID_APP_ID` | Firebase **App ID** of the Android app, e.g. `1:1234567890:android:abcdef` | Firebase Console → Project settings → *Your apps* (Android) |
| `FIREBASE_IOS_APP_ID` | Firebase **App ID** of the iOS app, e.g. `1:1234567890:ios:abcdef` | Firebase Console → Project settings → *Your apps* (iOS) |

### Repository variables (optional)

| Variable | Default | Notes |
| --- | --- | --- |
| `FIREBASE_TESTER_GROUPS` | `testers` | Comma-separated Firebase App Distribution tester group aliases |

## One-time prerequisites

1. **Expo / EAS project** — link the project once locally:
   ```bash
   npx eas-cli@latest init        # sets expo.owner + a project id
   ```
2. **iOS credentials** — EAS manages the signing cert & ad-hoc provisioning
   profile. The first iOS build will prompt for Apple credentials; run it once
   interactively, or pre-provision:
   ```bash
   npx eas-cli@latest credentials --platform ios
   ```
   Make sure tester devices' UDIDs are registered (ad-hoc) so the `.ipa`
   installs:
   ```bash
   npx eas-cli@latest device:create
   ```
3. **Android signing** — handled automatically by EAS (a keystore is generated
   and stored on EAS the first time).
4. **Firebase apps** — create the Android (`com.moneycat.app`) and iOS
   (`com.moneycat.app`) apps in the Firebase Console and create at least one
   tester group.

> Note: For App Distribution alone you do **not** need `google-services.json` /
> `GoogleService-Info.plist` bundled in the app — only the Firebase **App ID**
> and a service account to upload. Add those plist/json files only if you later
> integrate the Firebase SDK into the app itself.

## Run locally (optional)

```bash
# Build only
npx eas-cli@latest build --platform all --profile firebase

# Then upload manually
firebase appdistribution:distribute app.apk \
  --app "$FIREBASE_ANDROID_APP_ID" --groups testers
```
