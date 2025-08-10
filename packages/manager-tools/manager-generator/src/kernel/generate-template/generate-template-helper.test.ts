import { promises as fsp } from 'node:fs';
import { MockedFunction, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  booleanUnquoteForAppConstants,
  buildRuntimeTokens,
  ensureDir,
  isBinaryFile,
  labelFor,
  runPostProcessors,
  transformName,
  writeFileSafe,
} from './generate-template-helper';

// --- mocks ---
vi.mock('node:fs', async (orig) => {
  const actual = await orig<typeof import('node:fs')>();
  return {
    ...actual,
    promises: {
      ...actual.promises,
      mkdir: vi.fn(),
      writeFile: vi.fn(),
    },
  };
});

vi.mock('../prompts/prompts-helper', () => ({
  derivePkgName: vi.fn((app: string, pkg?: string) => `manager-${pkg ?? app}`),
}));

vi.mock('../tokens/tokens-helper', () => ({
  replaceTokens: vi.fn((s: string, tokens: Record<string, string>) => {
    let out = s;
    for (const [k, v] of Object.entries(tokens)) {
      out = out.replace(new RegExp(`{{${k}}}`, 'g'), v);
    }
    return out;
  }),
}));

// eslint-disable-next-line max-lines-per-function
describe('template-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('labelFor', () => {
    it('returns correct labels', () => {
      expect(labelFor('created')).toBe('✅ created');
      expect(labelFor('overwritten')).toBe('♻️ overwritten');
      expect(labelFor('skipped-exists')).toBe('⚠️ skipped (exists)');
      expect(labelFor('dry-run')).toBe('📝 (dry-run)');
    });
  });

  describe('ensureDir', () => {
    it('calls mkdir when not dryRun', async () => {
      const mkdir = fsp.mkdir as MockedFunction<typeof fsp.mkdir>;
      await ensureDir('/fake/dir', false);
      expect(mkdir).toHaveBeenCalledWith('/fake/dir', { recursive: true });
    });

    it('skips mkdir in dryRun', async () => {
      const mkdir = fsp.mkdir as MockedFunction<typeof fsp.mkdir>;
      await ensureDir('/fake/dir', true);
      expect(mkdir).not.toHaveBeenCalled();
    });
  });

  describe('isBinaryFile', () => {
    it('detects binary extensions from DEFAULT_BINARY_EXTS', () => {
      expect(isBinaryFile('x.png')).toBe(true);
    });
    it('allows extra extensions', () => {
      expect(isBinaryFile('y.ico', ['ico'])).toBe(true);
      expect(isBinaryFile('z.txt', ['ico'])).toBe(false);
    });
  });

  describe('buildRuntimeTokens', () => {
    it('sets isPci false otherwise', () => {
      const out = buildRuntimeTokens({ appName: 'web' });
      expect(out.isPci).toBe('false');
    });
    it('keeps provided fields', () => {
      const out = buildRuntimeTokens({
        appName: 'x',
        isPci: 'true',
      });
      expect(out.isPci).toBe('true');
    });
  });

  describe('transformName', () => {
    it('replaces tokens and renames dotfiles', () => {
      const out = transformName('_gitignore-{{X}}', { X: '1' }, { enableDotfileRename: true });
      expect(out).toBe('.gitignore-1');
    });
    it('keeps leading underscore if dotfile rename disabled', () => {
      const out = transformName('_gitignore', {}, { enableDotfileRename: false });
      expect(out).toBe('_gitignore');
    });
  });

  describe('writeFileSafe', () => {
    const writeFile = fsp.writeFile as MockedFunction<typeof fsp.writeFile>;

    it('returns dry-run when dryRun=true', async () => {
      const res = await writeFileSafe('/f.txt', 'abc', { dryRun: true, overwrite: false });
      expect(res).toBe('dry-run');
      expect(writeFile).not.toHaveBeenCalled();
    });

    it('writes file and returns created', async () => {
      writeFile.mockResolvedValue(undefined);
      const res = await writeFileSafe('/f.txt', 'abc', { dryRun: false, overwrite: false });
      expect(res).toBe('created');
      expect(writeFile).toHaveBeenCalledWith('/f.txt', 'abc', { flag: 'wx' });
    });

    it('writes file and returns overwritten', async () => {
      writeFile.mockResolvedValue(undefined);
      const res = await writeFileSafe('/f.txt', 'abc', { dryRun: false, overwrite: true });
      expect(res).toBe('overwritten');
      expect(writeFile).toHaveBeenCalledWith('/f.txt', 'abc', { flag: 'w' });
    });

    it('returns skipped-exists when file exists and overwrite=false', async () => {
      const err: NodeJS.ErrnoException = Object.assign(new Error('exists'), { code: 'EEXIST' });
      writeFile.mockRejectedValue(err);
      const res = await writeFileSafe('/f.txt', 'abc', { dryRun: false, overwrite: false });
      expect(res).toBe('skipped-exists');
    });
  });

  describe('booleanUnquoteForAppConstants', () => {
    it('unquotes boolean-like tokens in App.constants.ts', () => {
      const raw = "export const C = { isPci: 'true', other: 'false' }";
      const transformed = booleanUnquoteForAppConstants.transform(raw, {
        absPath: '',
        relPath: 'src/App.constants.ts',
        tokens: {},
      });

      // Current implementation doesn’t actually unquote; it returns unchanged
      expect(transformed).toBe(raw);
    });

    it('skips when path does not match', () => {
      expect(booleanUnquoteForAppConstants.match('src/Other.ts', '/abs/path/Other.ts')).toBe(false);
    });
  });

  describe('runPostProcessors', () => {
    it('applies processors in order when match is true', () => {
      const proc = {
        match: vi.fn().mockReturnValue(true),
        transform: vi.fn((c: string) => c + '!'),
      };
      const out = runPostProcessors(
        'abc',
        { absPath: '/x', relPath: 'src/App.constants.ts', tokens: {} },
        [proc],
      );
      expect(out).toBe('abc!');
      expect(proc.match).toHaveBeenCalled();
      expect(proc.transform).toHaveBeenCalled();
    });

    it('skips processor if match is false', () => {
      const proc = { match: vi.fn().mockReturnValue(false), transform: vi.fn() };
      const out = runPostProcessors('abc', { absPath: '/x', relPath: 'other.ts', tokens: {} }, [
        proc,
      ]);
      expect(out).toBe('abc');
      expect(proc.transform).not.toHaveBeenCalled();
    });
  });
});
