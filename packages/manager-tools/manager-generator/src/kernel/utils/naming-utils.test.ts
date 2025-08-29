import { describe, expect, it } from 'vitest';

import { derivePkgName, ensureSuffix, isNameValue, isSeparatorLike } from './naming-utils';

describe('ensureSuffix', () => {
  it('appends suffix if missing', () => {
    expect(ensureSuffix('demo', '-app')).toBe('demo-app');
  });
  it('does not duplicate suffix', () => {
    expect(ensureSuffix('demo-app', '-app')).toBe('demo-app');
  });
});

describe('derivePkgName', () => {
  it('uses explicit packageName if provided', () => {
    expect(derivePkgName('ignored', 'custom')).toBe('custom');
  });
  it('normalizes and ensures suffix', () => {
    expect(derivePkgName('Web')).toBe('@ovh-ux/manager-web-app');
  });
});

describe('isNameValue', () => {
  it('detects valid pair', () => {
    expect(isNameValue({ name: 'a', value: 'b' })).toBe(true);
  });
  it('rejects invalid', () => {
    expect(isNameValue({ type: 'separator' })).toBe(false);
  });
});

describe('isSeparatorLike', () => {
  it('detects separator objects', () => {
    expect(isSeparatorLike({ type: 'separator' })).toBe(true);
  });
  it('rejects others', () => {
    expect(isSeparatorLike({ type: 'not' })).toBe(false);
  });
});
