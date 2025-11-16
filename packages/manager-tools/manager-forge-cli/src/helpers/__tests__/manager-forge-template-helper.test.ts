import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { TemplateValue } from '@/types/TemplateType.js';

import {
  applyTemplateReplacements,
  copyTemplate,
  ensureDirectory,
  replaceTemplateStrings,
  safeWriteFile,
} from '../manager-forge-template-helper.js';

let tmpRoot: string;

beforeEach(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-template-'));
});

afterEach(() => {
  // Clean up the tmp directory after each test
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

describe('ensureDirectory', () => {
  it('creates the directory when it does not exist', () => {
    const targetDir = path.join(tmpRoot, 'nested', 'dir');

    expect(fs.existsSync(targetDir)).toBe(false);

    ensureDirectory(targetDir);

    expect(fs.existsSync(targetDir)).toBe(true);
  });

  it('does not recreate the directory if it already exists', () => {
    const targetDir = path.join(tmpRoot, 'existing');

    fs.mkdirSync(targetDir, { recursive: true });
    const mkdirSpy = vi.spyOn(fs, 'mkdirSync');

    ensureDirectory(targetDir);

    expect(fs.existsSync(targetDir)).toBe(true);
    expect(mkdirSpy).not.toHaveBeenCalled();

    mkdirSpy.mockRestore();
  });
});

describe('copyTemplate', () => {
  it('recursively copies files and directories from src to dest', () => {
    const srcDir = path.join(tmpRoot, 'src');
    const destDir = path.join(tmpRoot, 'dest');

    // Build source structure
    ensureDirectory(srcDir);
    const srcNested = path.join(srcDir, 'nested');
    ensureDirectory(srcNested);

    const file1 = path.join(srcDir, 'file1.txt');
    const file2 = path.join(srcNested, 'file2.txt');

    fs.writeFileSync(file1, 'FILE1', 'utf8');
    fs.writeFileSync(file2, 'FILE2', 'utf8');

    // Ensure dest root exists
    ensureDirectory(destDir);

    copyTemplate(srcDir, destDir);

    const destFile1 = path.join(destDir, 'file1.txt');
    const destNested = path.join(destDir, 'nested');
    const destFile2 = path.join(destNested, 'file2.txt');

    expect(fs.existsSync(destFile1)).toBe(true);
    expect(fs.readFileSync(destFile1, 'utf8')).toBe('FILE1');

    expect(fs.existsSync(destNested)).toBe(true);
    expect(fs.existsSync(destFile2)).toBe(true);
    expect(fs.readFileSync(destFile2, 'utf8')).toBe('FILE2');
  });
});

describe('replaceTemplateStrings', () => {
  it('replaces placeholders in plain text content', () => {
    const content = 'Hello {{name}}, your id is {{id}}.';
    const data: Record<string, TemplateValue> = {
      name: 'World',
      id: 42,
    };

    const result = replaceTemplateStrings(content, data);

    expect(result).toBe('Hello World, your id is 42.');
  });

  it('replaces placeholders in JSON content (simple case)', () => {
    const templateObj = {
      greeting: 'Hello {{name}}',
    };
    const content = JSON.stringify(templateObj, null, 2);

    const data: Record<string, TemplateValue> = {
      name: 'World',
    };

    const result = replaceTemplateStrings(content, data, 'greeting.json');
    const parsed = JSON.parse(result) as { greeting: string };

    expect(parsed.greeting).toBe('Hello World');
  });

  it('injects array values into JSON arrays using placeholder entries', () => {
    const templateObj = {
      users: ['admin', '{{extraUsers}}', 'guest'],
    };
    const content = JSON.stringify(templateObj, null, 2);

    const data: Record<string, TemplateValue> = {
      extraUsers: ['user1', 'user2'],
    };

    const result = replaceTemplateStrings(content, data, 'users.json');
    const parsed = JSON.parse(result) as { users: string[] };

    expect(parsed.users).toEqual(['admin', 'user1', 'user2', 'guest']);
  });

  it('falls back to plain string replacement when JSON is invalid but file has .json extension', () => {
    const content = 'not-json {{name}}';
    const data: Record<string, TemplateValue> = {
      name: 'World',
    };

    const result = replaceTemplateStrings(content, data, 'broken.json');

    expect(result).toBe('not-json World');
  });
});

describe('safeWriteFile', () => {
  it('writes valid JSON to disk', () => {
    const filePath = path.join(tmpRoot, 'valid.json');
    const content = JSON.stringify({ foo: 'bar' }, null, 2);

    safeWriteFile(filePath, content);

    const written = fs.readFileSync(filePath, 'utf8');
    expect(written).toBe(content);
  });

  it('logs an error and throws for invalid JSON', () => {
    const filePath = path.join(tmpRoot, 'invalid.json');
    const content = '{ invalid json';

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const writeSpy = vi.spyOn(fs, 'writeFileSync');

    expect(() => safeWriteFile(filePath, content)).toThrow();

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(writeSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
    writeSpy.mockRestore();
  });

  it('writes non-JSON files without JSON validation', () => {
    const filePath = path.join(tmpRoot, 'plain.txt');
    const content = 'some text {{no-json-check}}';

    safeWriteFile(filePath, content);

    const written = fs.readFileSync(filePath, 'utf8');
    expect(written).toBe(content);
  });
});

describe('applyTemplateReplacements', () => {
  it('applies replacements to existing files', () => {
    const filePath = path.join(tmpRoot, 'template.txt');
    fs.writeFileSync(filePath, 'Hello {{name}}!', 'utf8');

    const data: Record<string, TemplateValue> = {
      name: 'OVH',
    };

    applyTemplateReplacements([filePath], data);

    const updated = fs.readFileSync(filePath, 'utf8');
    expect(updated).toBe('Hello OVH!');
  });

  it('applies JSON-aware replacements to JSON files', () => {
    const filePath = path.join(tmpRoot, 'users.json');
    const templateObj = {
      users: ['admin', '{{extraUsers}}'],
    };
    const content = JSON.stringify(templateObj, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');

    const data: Record<string, TemplateValue> = {
      extraUsers: ['user1', 'user2'],
    };

    applyTemplateReplacements([filePath], data);

    const updated = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(updated) as { users: string[] };

    expect(parsed.users).toEqual(['admin', 'user1', 'user2']);
  });

  it('skips files that do not exist', () => {
    const missingPath = path.join(tmpRoot, 'does-not-exist.txt');

    const data: Record<string, TemplateValue> = {
      name: 'Ignored',
    };

    const readSpy = vi.spyOn(fs, 'readFileSync');

    applyTemplateReplacements([missingPath], data);

    expect(readSpy).not.toHaveBeenCalled();

    readSpy.mockRestore();
  });
});
