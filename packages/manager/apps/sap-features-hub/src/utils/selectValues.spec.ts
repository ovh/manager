import { describe, it, expect } from 'vitest';
import {
  getSelectDefaultValue,
  getDefaultValueWithAutoSelect,
  getSelectLatestValue,
} from './selectValues';

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

describe('getDefaultValueWithAutoSelect test suite', () => {
  it('returns value as string if the value is among multiple options', () => {
    expect(getDefaultValueWithAutoSelect('yes', ['yes', 'no'])).toBe('yes');
    expect(getDefaultValueWithAutoSelect(1, [1, 2, 3])).toBe('1');
  });

  it('returns the first element as string if there is only one options', () => {
    expect(getDefaultValueWithAutoSelect('yes', ['no'])).toBe('no');
    expect(getDefaultValueWithAutoSelect(1, [3])).toBe('3');
    expect(getDefaultValueWithAutoSelect(undefined, ['yes'])).toBe('yes');
  });

  it('returns undefined if the value is not an available option', () => {
    expect(getDefaultValueWithAutoSelect('ok', ['yes', 'no'])).toBe(undefined);
    expect(getDefaultValueWithAutoSelect(1, [2, 3])).toBe(undefined);
  });

  it('returns undefined if options are empty or undefined', () => {
    expect(getDefaultValueWithAutoSelect('yes', [])).toBe(undefined);
    expect(getDefaultValueWithAutoSelect('yes', undefined)).toBe(undefined);
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
