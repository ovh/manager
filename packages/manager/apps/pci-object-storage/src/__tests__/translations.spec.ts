import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { resolve, join } from 'path';

const TRANSLATIONS_PATH = resolve(
  __dirname,
  '../../public/translations/pci-object-storage',
);

function getJsonFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    if (item.isDirectory()) return getJsonFiles(join(dir, item.name));
    if (item.name.endsWith('.json')) return [join(dir, item.name)];
    return [];
  });
}

describe('Translation files', () => {
  it('should not contain "&lt;" HTML entity', () => {
    const issues = getJsonFiles(TRANSLATIONS_PATH)
      .map((file) => ({ file, content: readFileSync(file, 'utf-8') }))
      .filter(({ content }) => content.includes('&lt;'))
      .map(({ file }) => file.replace(`${TRANSLATIONS_PATH}/`, ''));

    expect(issues, `Files containing "&lt;": ${issues.join(', ')}`).toEqual([]);
  });
});
