import { describe, it, expect } from 'vitest';
import { normalizeAccountId } from './normalize-account-id';

describe('normalizeAccountId', () => {
  it('should trim the input string', () => {
    expect(normalizeAccountId('  ab1234567-ovh  ')).toBe('ab1234567-ovh');
    expect(normalizeAccountId('  fake@email.com ')).toBe('fake@email.com');
  });

  it('should add -ovh suffix to non-email input string when needed', () => {
    expect(normalizeAccountId('ab1234567')).toBe('ab1234567-ovh');
    expect(normalizeAccountId('ab1234567-ovh')).toBe('ab1234567-ovh');
    expect(normalizeAccountId('fake@email.com')).toBe('fake@email.com');
  });

  it('should leave an empty string as empty', () => {
    expect(normalizeAccountId('')).toBe('');
    expect(normalizeAccountId('    ')).toBe('');
  });
});
