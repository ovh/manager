import { promises as fsp } from 'node:fs';
import path from 'node:path';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { assertNoUnresolvedTokens, replaceTokens } from '../tokens/tokens-helper';
import { ensureDir, isBinaryFile, writeFileSafe } from './generate-template-helper';
import { applyTemplates } from './generate-templates';

// --- mocks ---
vi.mock('node:fs', () => {
  return {
    promises: {
      readdir: vi.fn(),
      readFile: vi.fn(),
    },
  };
});

vi.mock('../tokens/tokens-helper', () => ({
  assertNoUnresolvedTokens: vi.fn(),
  // keep implementation minimal but don’t enforce extra keys
  replaceTokens: vi.fn().mockImplementation((c: string, tokens: Record<string, string>): string => {
    let out = c;
    for (const [k, v] of Object.entries(tokens)) {
      out = out.replace(new RegExp(`{{${k}}}`, 'g'), v);
    }
    return out;
  }),
}));

vi.mock('./generate-template-helper', () => ({
  buildRuntimeTokens: vi.fn().mockImplementation((t: Record<string, string>) => ({
    ...t,
  })),
  ensureDir: vi.fn().mockResolvedValue(undefined),
  isBinaryFile: vi.fn().mockReturnValue(false),
  labelFor: vi.fn().mockImplementation((r: string) => `[label:${r}]`),
  runPostProcessors: vi.fn().mockImplementation((c: string) => c),
  transformName: vi.fn().mockImplementation((n: string) => n),
  writeFileSafe: vi.fn().mockResolvedValue('written'),
  booleanUnquoteForAppConstants: vi.fn(),
}));

// eslint-disable-next-line max-lines-per-function
describe('applyTemplates', () => {
  const templateDir = '/fake/templates';
  const targetDir = '/fake/target';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes text files with token replacement', async () => {
    (fsp.readdir as unknown as Mock).mockResolvedValue([
      { name: 'file.txt', isDirectory: () => false, isFile: () => true },
    ]);
    (fsp.readFile as unknown as Mock).mockResolvedValue('Hello {{TOKEN}}');

    await applyTemplates({
      templateDir,
      targetDir,
      tokens: { TOKEN: 'VALUE' },
    });

    expect(ensureDir).toHaveBeenCalledWith(targetDir, false);
    // ✅ don’t assert derived:true (not injected in buildRuntimeTokens mock)
    expect(replaceTokens).toHaveBeenCalledWith('Hello {{TOKEN}}', { TOKEN: 'VALUE' });
    expect(assertNoUnresolvedTokens).toHaveBeenCalled();
    expect(writeFileSafe).toHaveBeenCalledWith(path.join(targetDir, 'file.txt'), 'Hello VALUE', {
      dryRun: false,
      overwrite: false,
    });
  });

  it('skips ignored entries', async () => {
    (fsp.readdir as unknown as Mock).mockResolvedValue([
      { name: 'skipme', isDirectory: () => false, isFile: () => true },
    ]);

    await applyTemplates({
      templateDir,
      targetDir,
      tokens: {},
      ignore: ['skipme'],
    } as unknown as Parameters<typeof applyTemplates>[0]);

    expect(writeFileSafe).not.toHaveBeenCalled();
  });

  it('treats binary files separately', async () => {
    (fsp.readdir as unknown as Mock).mockResolvedValue([
      { name: 'image.png', isDirectory: () => false, isFile: () => true },
    ]);
    (isBinaryFile as Mock).mockReturnValue(true);
    (fsp.readFile as unknown as Mock).mockResolvedValue(Buffer.from('data'));

    await applyTemplates({
      templateDir,
      targetDir,
      tokens: {},
    });

    expect(writeFileSafe).toHaveBeenCalledWith(
      path.join(targetDir, 'image.png'),
      expect.any(Buffer),
      { dryRun: false, overwrite: false },
    );
  });

  it('recursively processes subdirectories', async () => {
    (fsp.readdir as unknown as Mock).mockResolvedValueOnce([
      { name: 'sub', isDirectory: () => true, isFile: () => false },
    ]);
    (fsp.readdir as unknown as Mock).mockResolvedValueOnce([
      { name: 'inner.txt', isDirectory: () => false, isFile: () => true },
    ]);
    (fsp.readFile as unknown as Mock).mockResolvedValue('X');

    await applyTemplates({
      templateDir,
      targetDir,
      tokens: {},
    });

    expect(ensureDir).toHaveBeenCalledWith(path.join(targetDir, 'sub'), false);
    expect(writeFileSafe).toHaveBeenCalledWith(path.join(targetDir, 'sub', 'inner.txt'), 'X', {
      dryRun: false,
      overwrite: false,
    });
  });

  it('supports dryRun mode (no writes)', async () => {
    (fsp.readdir as unknown as Mock).mockResolvedValue([
      { name: 'file.txt', isDirectory: () => false, isFile: () => true },
    ]);
    (fsp.readFile as unknown as Mock).mockResolvedValue('Dry app-test-mock');

    await applyTemplates({
      templateDir,
      targetDir,
      tokens: { appName: 'app-test-mock' },
      dryRun: true,
    });

    // ✅ assert on replaced string
    expect(writeFileSafe).toHaveBeenCalledWith(
      path.join(targetDir, 'file.txt'),
      'Dry app-test-mock',
      {
        dryRun: true,
        overwrite: false,
      },
    );
  });
});
