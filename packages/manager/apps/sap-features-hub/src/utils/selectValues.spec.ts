import { describe, it, expect } from 'vitest';
import { getSelectDefaultValue, getSelectLatestValue } from './selectValues';

describe('getSelectDefaultValue test suite', () => {
  it('returns value as string if the value is an available option', () => {
    expect(getSelectDefaultValue('yes', ['yes', 'no'])).toBe('yes');
    expect(getSelectDefaultValue(1, [1, 2, 3])).toBe('1');
  });

  it('returns undefined if the value is not an available option', () => {
    expect(getSelectDefaultValue('yes', ['no'])).toBe(undefined);
    expect(getSelectDefaultValue(1, [2, 3])).toBe(undefined);
  });

  it('returns undefined if options are empty or undefined', () => {
    expect(getSelectDefaultValue('yes', [])).toBe(undefined);
    expect(getSelectDefaultValue('yes', undefined)).toBe(undefined);
  });
});

describe('getSelectLatestValue test suite', () => {
  const value = 'newValue';
  const prefilledValue = 'prefilledValue';
  it('returns the value if not prefilled', () => {
    expect(
      getSelectLatestValue({ isPrefilled: false, value, prefilledValue }),
    ).toEqual(value);
  });

  it('returns the value if prefilled and value has changed', () => {
    expect(
      getSelectLatestValue({ isPrefilled: true, value, prefilledValue }),
    ).toEqual(value);
  });

  it('returns the prefilledValue if prefilled without new value', () => {
    expect(
      getSelectLatestValue({ isPrefilled: true, value: '', prefilledValue }),
    ).toEqual(prefilledValue);
  });
});
