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

## Dependency security fixes

`@expo/cli` resolves Zod 4.6.7 through a scoped npm override. Regression tests exercise Expo's plugin descriptors, structured output, MCP registration/schema parameters, and oversized bounded arrays, maps, sets, and asynchronous arrays. Oversized collections with leading size constraints reject before element validation. This does not impose new limits on schemas that intentionally have no size constraint.

Expo and Jest resolve `deepmerge` through the local `vendor/deepmerge` security backport, anchored by the direct file dependency and npm override. The patch protects all three result-property writes while preserving the upstream API and MIT license. See the vendor README for provenance and removal instructions. The package is local code and therefore requires regression tests and review in addition to registry auditing.

Run `npm run test:security` after dependency updates. CI runs these tests before TypeScript, lint and bundle exports. No advisory suppression or install-time patch script is used.
