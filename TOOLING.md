# Tooling maintenance

Updated October 29, 2026.

Expo SDK 58 and React Native 0.88 replace SDK 51 / RN 0.74. SDK-compatible React/native modules, TypeScript 6 and the current Expo lint preset are installed. Splash configuration uses the config plugin and navigation/status-bar options match the new SDK.

## Setup and verification

Use Node.js 26.13.0 (`nvm use` from the repository root) and npm 12.2.1.

```sh
npm install --global npm@12.2.1
cd icarus-mobile
npm ci
npm run typecheck
npm run lint
npx expo install --check
npx expo-doctor
npm run export
```

All 20 Expo Doctor checks pass. iOS, Android and web JavaScript bundles export successfully. Native device/simulator testing and signed builds are still required before release. Existing effect synchronization lint findings remain warnings. TypeScript, Babel and ESLint stay on the newest versions compatible with Expo and its plugins, rather than incompatible major releases.

CI runs on pull requests and pushes. Dependabot checks the package manifests and GitHub Actions weekly, grouping compatible minor/patch updates. Major updates remain separate for review.

## Upstream advisories still open

The current Expo/Jest dependency tree still reports 14 affected package entries originating from two advisories:

- `deepmerge` 4.3.1: [prototype poisoning](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). This is the newest published release and Expo/Jest require it.
- Expo CLI's Zod 3: [memory exhaustion](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). The patched Zod 4 release is outside Expo CLI's declared supported range.

Do not use `npm audit fix --force`: its proposed remedy downgrades Expo to SDK 54. No incompatible transitive override or audit suppression is included. Recheck when Expo/Jest release compatible fixes.
