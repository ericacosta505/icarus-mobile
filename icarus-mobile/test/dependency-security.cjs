const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const path = require('node:path');

const expoConfigRequire = createRequire(require.resolve('@expo/config/package.json'));
const jestConfigRequire = createRequire(require.resolve('jest-config/package.json'));
const cliRequire = createRequire(require.resolve('@expo/cli/package.json'));
const cliRoot = path.dirname(require.resolve('@expo/cli/package.json'));
const cliModule = (file) => require(path.join(cliRoot, 'build/src/start/server', file));
const merge = expoConfigRequire('deepmerge');
const { validate, ValidationError } = cliRequire('@expo/schema-utils');
// CLI descriptors now use JSON Schema. MCP receives Zod from optional expo-mcp;
// this direct devDependency is a test fixture, not evidence of CLI's resolution.
const { z } = require('zod');
const payload = () => JSON.parse('{"__proto__":{"injected":true}}');

function assertSafe(value) {
  assert.equal(Object.getPrototypeOf(value), Object.prototype);
  assert.equal(value.injected, undefined);
  assert.equal(Object.prototype.injected, undefined);
}

test('Expo and Jest both resolve the checked-in security backport', () => {
  const expected = require.resolve('../vendor/deepmerge');
  assert.equal(expoConfigRequire.resolve('deepmerge'), expected);
  assert.equal(jestConfigRequire.resolve('deepmerge'), expected);
  assert.equal(jestConfigRequire('deepmerge'), merge);
});

test('target-owned, source-owned and null-prototype payloads cannot change prototypes', () => {
  for (const [target, source] of [
    [payload(), {}], [{}, payload()], [Object.create(null), payload()],
    [payload(), payload()],
  ]) assertSafe(merge(target, source));
  const output = merge(payload(), {});
  assert.deepEqual(Object.getOwnPropertyDescriptor(output, '__proto__'), {
    value: { injected: true }, writable: true, enumerable: true, configurable: true,
  });
});

test('nested objects, arrays, all() and custom merges cannot bypass safe writes', () => {
  assertSafe(merge({ nested: payload() }, { nested: {} }).nested);
  assertSafe(merge({ nested: Object.create(null) }, { nested: payload() }).nested);
  assertSafe(merge([], [payload()])[0]);
  assertSafe(merge.all([payload(), {}]));
  assertSafe(merge(payload(), payload(), {
    customMerge: (key) => key === '__proto__' ? () => ({ injected: true }) : undefined,
  }));
  assertSafe(merge(JSON.parse('{"constructor":{"prototype":{"injected":true}}}'), {}));
});

test('normal merges preserve cloning, symbols, special objects and array hooks', () => {
  const symbol = Symbol('metadata');
  const date = new Date('2026-01-01');
  const regexp = /example/i;
  const original = { nested: { a: 1 }, list: [1], date, regexp, [symbol]: { ok: true } };
  const output = merge(original, { nested: { b: 2 }, list: [2] });
  assert.deepEqual(output.nested, { a: 1, b: 2 });
  assert.notEqual(output.nested, original.nested);
  assert.deepEqual(output.list, [1, 2]);
  assert.equal(output.date, date);
  assert.equal(output.regexp, regexp);
  assert.deepEqual(output[symbol], { ok: true });
  assert.notEqual(output[symbol], original[symbol]);
  assert.equal(merge({}, original, { clone: false }).nested, original.nested);
  assert.deepEqual(merge({ list: [1, 2] }, { list: [2, 3] }, {
    arrayMerge: (left, right) => [...new Set([...left, ...right])],
  }).list, [1, 2, 3]);
  assert.deepEqual(merge.all([{ a: 1 }, { b: 2 }]), { a: 1, b: 2 });
  assert.throws(() => merge.all({}), /first argument should be an array/);
});

test('the MCP security regression fixture uses patched Zod 4', () => {
  assert.equal(require('zod/package.json').version, '4.6.7');
});

for (const kind of ['array', 'set', 'map']) {
  test(`oversized constrained ${kind} rejects before visiting elements`, () => {
    let visits = 0;
    const element = z.any().superRefine(() => { visits++; });
    const values = Array.from({ length: 1000 }, (_, i) => i);
    const schema = kind === 'array' ? z.array(element).max(2)
      : kind === 'set' ? z.set(element).max(2) : z.map(z.number(), element).max(2);
    const input = kind === 'array' ? values : kind === 'set' ? new Set(values)
      : new Map(values.map((n) => [n, n]));
    const result = schema.safeParse(input);
    assert.equal(result.success, false);
    assert.equal(visits, 0);
    assert.equal(result.error.issues.length, 1);
    assert.equal(result.error.issues[0].code, 'too_big');
    const small = kind === 'array' ? [1] : kind === 'set' ? new Set([1]) : new Map([[1, 1]]);
    assert.equal(schema.safeParse(small).success, true);
    assert.equal(visits, 1);
  });
}

test('asynchronous exact-length schemas also reject before element validation', async () => {
  let visits = 0;
  const schema = z.array(z.any().superRefine(async () => { visits++; })).length(1);
  const result = await schema.safeParseAsync(Array(1000).fill(null));
  assert.equal(result.success, false);
  assert.equal(visits, 0);
  assert.equal(result.error.issues.length, 1);
});

const plugin = {
  packageName: 'test-plugin', packageRoot: '/test-plugin',
  cliExtensions: {
    description: 'Test commands', entryPoint: 'cli.js',
    commands: [{ name: 'inspect', title: 'Inspect', environments: ['cli', 'mcp'],
      parameters: [{ name: 'count', type: 'number' }, { name: 'enabled', type: 'confirm' },
        { name: 'label', type: 'text' }] }],
  },
};

test('actual Expo plugin JSON Schema and constructor validate descriptors', () => {
  const { PluginSchema } = cliModule('devtools/DevToolsPlugin.schema.js');
  const { DevToolsPlugin } = cliModule('devtools/DevToolsPlugin.js');
  assert.doesNotThrow(() => validate(PluginSchema, plugin));
  assert.equal(new DevToolsPlugin(plugin, '/project').packageName, plugin.packageName);

  const command = plugin.cliExtensions.commands[0];
  const invalidPlugins = [
    { ...plugin, packageName: '' },
    { ...plugin, packageRoot: undefined },
    { ...plugin, cliExtensions: { ...plugin.cliExtensions, entryPoint: '' } },
    { ...plugin, cliExtensions: { ...plugin.cliExtensions, commands: [] } },
    ...[
      { ...command, name: '' },
      { ...command, environments: ['unknown'] },
      { ...command, parameters: [{ name: 'count', type: 'unknown' }] },
      { ...command, parameters: [{ type: 'number' }] },
    ].map((invalidCommand) => ({
      ...plugin, cliExtensions: { ...plugin.cliExtensions, commands: [invalidCommand] },
    })),
  ];
  for (const invalid of invalidPlugins) {
    assert.throws(() => validate(PluginSchema, invalid), ValidationError);
    assert.throws(() => new DevToolsPlugin(invalid, '/project'), (error) => {
      assert.match(error.message, /Invalid plugin configuration/);
      assert.ok(error.cause instanceof ValidationError);
      return true;
    });
  }
});

test('actual Expo output JSON Schema rejects malformed structured output', () => {
  const { DevToolsPluginOutputSchema } = cliModule('devtools/DevToolsPlugin.schema.js');
  const { DevToolsPluginCliExtensionResults } = cliModule('devtools/DevToolsPluginCliExtensionResults.js');
  const results = new DevToolsPluginCliExtensionResults();
  const output = [{ type: 'text', text: 'ok', level: 'info' },
    { type: 'image', url: 'https://example.com/image.png' },
    { type: 'audio', url: 'https://example.com/audio.mp3' }];
  assert.doesNotThrow(() => validate(DevToolsPluginOutputSchema, output));
  assert.deepEqual(results.parseOutputText(JSON.stringify(output)), output);
  for (const invalid of [
    [{}], [{ type: 'audio', url: 'invalid' }], [{ type: 'image', url: 'invalid' }],
    [{ type: 'audio' }], [{ type: 'video', url: 'https://example.com/video.mp4' }],
    [{ type: 'text', text: 'ok' }], [{ type: 'text', text: 'ok', level: 'debug' }],
    [{ type: 'text', text: 1, level: 'info' }], {}, null,
  ]) {
    assert.throws(() => validate(DevToolsPluginOutputSchema, invalid), ValidationError);
    const rejected = results.parseOutputText(JSON.stringify(invalid));
    assert.equal(rejected.length, 1);
    assert.equal(rejected[0].type, 'text');
    assert.equal(rejected[0].level, 'error');
    assert.match(rejected[0].text, /^Invalid JSON:/);
  }
  assert.deepEqual(results.parseOutputText('plain output'), [{ type: 'text', text: 'plain output', level: 'info' }]);
  assert.deepEqual(results.parseOutputText('first\n\nsecond', 'warning'), [
    { type: 'text', text: 'first', level: 'warning' },
    { type: 'text', text: 'second', level: 'warning' },
  ]);
});

test('Expo MCP registration keeps typed strict schemas and filters CLI-only commands', async () => {
  const { addMcpCapabilities } = cliModule('mcp/MCPDevToolsPluginCLIExtensions.js');
  const cliOnlyCommand = {
    name: 'local-only', title: 'CLI only', environments: ['cli'],
    parameters: [{ name: 'localPath', type: 'text' }],
  };
  const mixedPlugin = {
    ...plugin, cliExtensions: {
      ...plugin.cliExtensions, commands: [...plugin.cliExtensions.commands, cliOnlyCommand],
    },
  };
  const cliOnlyPlugin = {
    ...plugin, packageName: 'cli-only-plugin',
    cliExtensions: { ...plugin.cliExtensions, commands: [cliOnlyCommand] },
  };
  const noCommandsPlugin = { packageName: 'no-commands', packageRoot: '/no-commands' };
  const registered = [];
  await addMcpCapabilities({ registerTool(name, config) { registered.push({ name, config }); } }, {
    devtoolsPluginManager: { queryPluginsAsync: async () => [mixedPlugin, cliOnlyPlugin, noCommandsPlugin] },
  }, z);
  assert.deepEqual(registered.map(({ name }) => name), [plugin.packageName]);
  const schema = registered[0].config.inputSchema.parameters;
  assert.equal(schema.safeParse({ command: 'inspect', count: 2, enabled: true, label: 'ok' }).success, true);
  assert.equal(schema.safeParse({ command: 'inspect' }).success, true);
  for (const input of [{}, { command: 'unknown' }, { command: 'local-only' },
    { command: 'inspect', count: '2' }, { command: 'inspect', enabled: 'true' },
    { command: 'inspect', label: 2 }, { command: 'inspect', unexpected: 1 },
    { command: 'inspect', localPath: '/private' }]) {
    assert.equal(schema.safeParse(input).success, false);
  }
  const jsonSchema = z.toJSONSchema(schema);
  assert.equal(jsonSchema.additionalProperties, false);
  assert.deepEqual(jsonSchema.properties.command.enum, ['inspect']);
  assert.equal(jsonSchema.properties.localPath, undefined);
  assert.deepEqual(mixedPlugin.cliExtensions.commands.map(({ name }) => name), ['inspect', 'local-only']);
});
