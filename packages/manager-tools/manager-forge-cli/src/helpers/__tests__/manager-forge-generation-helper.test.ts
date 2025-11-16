import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { GeneratorOptions } from '@/types/GenerationType.js';

import {
  assertNonEmpty,
  ensureApplicationExists,
  ensureDirectoryExists,
  forgeGenerateCli,
  formatName,
  generateFile,
  parseArgs,
  toCamelCase,
  toPascalCase,
} from '../manager-forge-generation-helper.js';

describe('parseArgs', () => {
  it('parses flags with values into a map', () => {
    const result = parseArgs(['--app', 'my-app', '--api', 'User']);

    expect(result).toEqual({
      app: 'my-app',
      api: 'User',
    });
  });

  it('skips flags without value and warns', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = parseArgs(['--app', '--api', 'User']);

    expect(result).toEqual({
      api: 'User',
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const warnCall = warnSpy.mock.calls[0];
    expect(warnCall).toBeDefined();
    const [message] = warnCall as [unknown];
    expect(String(message)).toContain('Missing value for flag --app');

    warnSpy.mockRestore();
  });
});

describe('assertNonEmpty', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when the value is non-empty', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);

    assertNonEmpty('value', '--flag');

    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('logs an error and exits when the value is empty', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);

    assertNonEmpty('', '--app');

    expect(errorSpy).toHaveBeenCalled();

    const errorCall = errorSpy.mock.calls[0];
    expect(errorCall).toBeDefined();
    const [message] = errorCall as [unknown];
    expect(String(message)).toContain('Missing required flag --app');

    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('ensureApplicationExists', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when the directory exists', () => {
    const existsSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);

    const dir = '/some/app';
    ensureApplicationExists(dir);

    expect(existsSpy).toHaveBeenCalledWith(dir);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();

    existsSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('logs an error and exits when the directory is missing', () => {
    const existsSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);

    const dir = '/missing/app';
    ensureApplicationExists(dir);

    expect(existsSpy).toHaveBeenCalledWith(dir);
    expect(errorSpy).toHaveBeenCalled();

    const errorCall = errorSpy.mock.calls[0];
    expect(errorCall).toBeDefined();
    const [message] = errorCall as [unknown];
    expect(String(message)).toContain('App not found at: /missing/app');

    expect(exitSpy).toHaveBeenCalledWith(1);

    existsSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('ensureDirectoryExists', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates the directory if it does not exist', () => {
    const existsSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation((() => {}) as never);

    const dir = '/some/dir';
    ensureDirectoryExists(dir);

    expect(existsSpy).toHaveBeenCalledWith(dir);
    expect(mkdirSpy).toHaveBeenCalledWith(dir, { recursive: true });

    existsSpy.mockRestore();
    mkdirSpy.mockRestore();
  });

  it('does not create the directory if it already exists', () => {
    const existsSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation((() => {}) as never);

    const dir = '/existing/dir';
    ensureDirectoryExists(dir);

    expect(existsSpy).toHaveBeenCalledWith(dir);
    expect(mkdirSpy).not.toHaveBeenCalled();

    existsSpy.mockRestore();
    mkdirSpy.mockRestore();
  });
});

describe('toPascalCase', () => {
  it('converts strings to PascalCase', () => {
    expect(toPascalCase('user-profile')).toBe('UserProfile');
    expect(toPascalCase('user profile')).toBe('UserProfile');
    expect(toPascalCase('user_profile')).toBe('UserProfile');
    expect(toPascalCase('  user   profile  ')).toBe('UserProfile');
    expect(toPascalCase('user')).toBe('User');
  });
});

describe('toCamelCase', () => {
  it('converts strings to camelCase', () => {
    expect(toCamelCase('user-profile')).toBe('userProfile');
    expect(toCamelCase('user profile')).toBe('userProfile');
    expect(toCamelCase('user_profile')).toBe('userProfile');
    expect(toCamelCase('UserProfile')).toBe('userProfile');
  });
});

describe('formatName', () => {
  it('applies PASCAL_CASE', () => {
    expect(formatName('user profile', 'PASCAL_CASE')).toBe('UserProfile');
  });

  it('applies CAMEL_CASE', () => {
    expect(formatName('user profile', 'CAMEL_CASE')).toBe('userProfile');
  });

  it('applies KEBAB_CASE', () => {
    expect(formatName('User Profile', 'KEBAB_CASE')).toBe('user-profile');
  });

  it('applies SNAKE_CASE', () => {
    expect(formatName('User Profile', 'SNAKE_CASE')).toBe('user_profile');
  });

  it('returns the input unchanged for unknown style', () => {
    // @ts-expect-error intentional invalid style to test default branch
    expect(formatName('User Profile', 'UNKNOWN_STYLE')).toBe('User Profile');
  });
});

describe('generateFile', () => {
  const appName = 'billing';
  const itemName = 'User Profile';

  const options: GeneratorOptions = {
    type: 'api',
    argKey: 'api',
    folder: 'data',
    extension: '.api.ts',
    caseStyle: 'PASCAL_CASE',
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a new file when it does not exist', () => {
    const appsDir = '/apps';
    const appDirectory = path.resolve(appsDir, appName);
    const targetDirectory = path.join(appDirectory, 'src', options.folder);
    const formattedName = formatName(itemName, options.caseStyle);
    const targetFilePath = path.join(targetDirectory, `${formattedName}${options.extension}`);

    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
      const value = String(p);
      if (value === appDirectory) return true; // app exists
      if (value === targetDirectory) return false; // folder missing -> create
      if (value === targetFilePath) return false; // file does not exist yet
      return false;
    });

    const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation((() => {}) as never);
    const writeFileSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation((() => {}) as never);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);

    generateFile({ appName, itemName, options, appsDir });

    expect(existsSyncSpy).toHaveBeenCalledWith(appDirectory);
    expect(existsSyncSpy).toHaveBeenCalledWith(targetDirectory);
    expect(existsSyncSpy).toHaveBeenCalledWith(targetFilePath);

    expect(mkdirSpy).toHaveBeenCalledWith(targetDirectory, { recursive: true });
    expect(writeFileSpy).toHaveBeenCalledWith(
      targetFilePath,
      `// ${options.type}: ${formattedName}\n`,
      'utf8',
    );
    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();

    existsSyncSpy.mockRestore();
    mkdirSpy.mockRestore();
    writeFileSpy.mockRestore();
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('logs an error and exits when the target file already exists', () => {
    const appsDir = '/apps';
    const appName = 'billing';
    const itemName = 'User Profile';

    const options: GeneratorOptions = {
      type: 'api',
      argKey: 'api',
      folder: 'data',
      extension: '.api.ts',
      caseStyle: 'PASCAL_CASE',
    };

    const appDirectory = path.resolve(appsDir, appName);
    const targetDirectory = path.join(appDirectory, 'src', options.folder);
    const formattedName = formatName(itemName, options.caseStyle);
    const targetFilePath = path.join(targetDirectory, `${formattedName}${options.extension}`);

    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
      const value = String(p);
      if (value === appDirectory) return true; // app exists
      if (value === targetDirectory) return true; // folder exists
      if (value === targetFilePath) return true; // file already exists
      return false;
    });

    const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation((() => {}) as never);
    const writeFileSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation((() => {}) as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Key change: make process.exit throw so execution stops before writeFileSync
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`EXIT ${code}`);
    }) as never);

    // generateFile should "exit", i.e. throw our fake EXIT error
    expect(() => generateFile({ appName, itemName, options, appsDir })).toThrow(/EXIT 1/);

    expect(errorSpy).toHaveBeenCalled();

    // Now this is true because the function never reaches writeFileSync
    expect(writeFileSpy).not.toHaveBeenCalled();

    existsSyncSpy.mockRestore();
    mkdirSpy.mockRestore();
    writeFileSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('forgeGenerateCli', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses args, validates them, and delegates to generateFile with the correct base path', () => {
    const options: GeneratorOptions = {
      type: 'api',
      argKey: 'api',
      folder: 'data',
      extension: '.api.ts',
      caseStyle: 'PASCAL_CASE',
    };

    const argv = ['--app', 'billing', '--api', 'UserProfile'];

    const appsDir = 'packages/manager/apps'; // same as APPLICATIONS_FOLDER_PATH
    const appDirectory = path.resolve(appsDir, 'billing');
    const targetDirectory = path.join(appDirectory, 'src', options.folder);
    const formattedName = formatName('UserProfile', options.caseStyle);
    const targetFilePath = path.join(targetDirectory, `${formattedName}${options.extension}`);

    const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
      const value = String(p);
      if (value === appDirectory) return true;
      if (value === targetDirectory) return false;
      if (value === targetFilePath) return false;
      return false;
    });

    const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation((() => {}) as never);
    const writeFileSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation((() => {}) as never);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);

    forgeGenerateCli(argv, options);

    expect(writeFileSpy).toHaveBeenCalledWith(
      targetFilePath,
      `// ${options.type}: ${formattedName}\n`,
      'utf8',
    );

    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();

    existsSyncSpy.mockRestore();
    mkdirSpy.mockRestore();
    writeFileSpy.mockRestore();
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
