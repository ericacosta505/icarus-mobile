# deepmerge security backport

Based on the published deepmerge 4.3.1 CommonJS distribution and original type declarations, under the included MIT license.

The only implementation change replaces all three assignments into a result object with `Object.defineProperty` data-property writes. This prevents target-owned and source-owned `__proto__` data from invoking an inherited prototype setter, including merges with null-prototype targets. The result remains an ordinary object. Own special keys remain inert data; enumerable symbol keys, cloning, `.all`, custom merge hooks and array hooks keep their original behavior.

The root npm override routes every installed deepmerge consumer to this private local package. This is maintained source code, not an audit exclusion or install-time mutation. Registry advisory scanners cannot assess this local patch; `npm run test:security` exercises the actual Expo/Jest resolutions, malicious inputs and compatibility controls.

Remove the override and this directory once upstream publishes a compatible fix, after running the same regression tests.

Upstream: https://github.com/TehShrike/deepmerge/tree/v4.3.1
Advisory: https://github.com/advisories/GHSA-gcqx-w48m-w2h4
