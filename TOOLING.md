# Tooling maintenance

Updated November 13, 2026.

Expo SDK 58 and React Native 0.88 replace SDK 51 / RN 0.74. SDK-compatible React/native modules, TypeScript 6 and the current Expo lint preset are installed. Splash configuration uses the config plugin and navigation/status-bar options match the new SDK.

## Setup and verification

Use Node.js 26.13.0 (`nvm use` from the repository root) and npm 12.2.1.

```sh
npm install --global npm@12.2.1
cd icarus-mobile
npm ci
npm run test:security
npm run typecheck
npm run lint
npx expo install --check
npx expo-doctor
npm run export
```

Native device/simulator testing and signed builds are still required before release, even when JavaScript exports pass. Existing effect synchronization lint findings remain warnings. TypeScript, Babel and ESLint stay on versions compatible with Expo and its plugins, rather than incompatible major releases.

Expo SDK 58 currently recommends Expo 58.0.25, React/React DOM 19.3.0, React Native 0.88.1, datetimepicker 9.2.1, gesture-handler 3.3.x, worklets 0.13.0 and safe-area-context 5.11.x. Keep these SDK-coupled packages aligned with `npx expo install --check`; a compatible semver update from Dependabot is not necessarily an Expo-supported update. The dependency repair uses Expo's published SDK 58 recommendations and bundled dependency map rather than excluding packages from validation.

If the Expo API cannot be reached, `EXPO_OFFLINE=1 npx expo install --check` checks the installed SDK's bundled map only. It is useful for local diagnosis, but does not replace the online check or Expo Doctor before merge/release.

CI runs on pull requests and pushes. Dependabot checks the package manifests and GitHub Actions weekly, grouping compatible minor/patch updates. Major updates remain separate for review.

## Dependency security fixes

Expo CLI 58.1.18 and later validate plugin descriptors and structured output through `@expo/schema-utils` JSON Schemas. The tests exercise the actual validator, plugin constructor and output parser, including malformed descriptors, output types and URLs. Modules now live in the CLI's `devtools/` and `mcp/` server subdirectories.

Expo CLI no longer declares Zod directly. Its optional MCP integration receives Zod from `expo-mcp`; this project does not install that optional integration. The obsolete CLI-scoped Zod override has therefore been removed. Zod 4.6.7 is an explicit development test fixture, injected into the actual MCP registration function to check strict typed parameters and rejection of CLI-only commands. If MCP is enabled later, review and test the Zod version actually resolved by `expo-mcp` rather than assuming this fixture covers it.

The Zod fixture also retains regression tests for oversized bounded arrays, maps, sets and asynchronous arrays. Oversized collections with leading size constraints reject before element validation. This does not impose new limits on schemas that intentionally have no size constraint.

Expo and Jest resolve `deepmerge` through the local `vendor/deepmerge` security backport, anchored by the direct file dependency and npm override. The patch protects all three result-property writes while preserving the upstream API and MIT license. See the vendor README for provenance and removal instructions. The package is local code and therefore requires regression tests and review in addition to registry auditing.

Run `npm run test:security` after dependency updates. CI runs these tests before TypeScript, lint and bundle exports. No advisory suppression or install-time patch script is used.

## November 13 dependency review

The SDK 58 patch refresh retains React/React DOM 19.3.0, datetimepicker 9.2.1, gesture-handler 3.3.x, SVG 15.16.0 and worklets 0.13.0, as required by Expo. Dependabot group #7 proposed incompatible versions of these packages; only its TypeScript ESLint parser patch is retained. Expo modules are refreshed together to the current SDK 58 recommendations.

Do not merge ESLint 10 (#8) or Babel 8 (#9) until Expo supports them. ESLint 10 crashes the React plugin bundled with the Expo lint preset (`contextOrFilename.getFilename is not a function`); Babel 8 is outside Expo's supported Babel 7 range. Keep compatibility validation enabled rather than excluding these packages.

Local validation on Node 26.13.0/npm 12.2.1 passed: 12 dependency-security regressions, TypeScript, lint (16 existing warnings, zero errors), online Expo compatibility, Expo Doctor (20/20), and Android/iOS/web exports. Registry audit reports 27 moderate findings, zero high/critical; this is not a claim that all dependency advisories are resolved. Native device validation is still required before a release.
