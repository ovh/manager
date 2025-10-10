import { describe, it } from 'vitest';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { getDataType } from '../v6.utils';

describe('getDataType Function', () => {
  it('returns Numeric type', () => {
    const res = getDataType(123);
    expect(res).toEqual(FilterTypeCategories.Numeric);
  });

  it('returns date type', () => {
    const res = getDataType(new Date('01/01/2025'));
    expect(res).toEqual(FilterTypeCategories.Date);
  });

  it('returns String type', () => {
    const res = getDataType('abc');
    expect(res).toEqual(FilterTypeCategories.String);
  });

  it('returns Boolean type', () => {
    let res = getDataType(true);
    expect(res).toEqual(FilterTypeCategories.Boolean);

    res = getDataType(false);
    expect(res).toEqual(FilterTypeCategories.Boolean);
  });

  it('returns Other types', () => {
    let res = getDataType({});
    expect(res).toEqual('object');

    res = getDataType(() => {
      return 1;
    });
    expect(res).toEqual('function');
  });
});
