import { describe, it } from 'vitest';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { dataType } from '../v6.utils';

describe('dataType Function', () => {
  it('returns Numeric type', () => {
    const res = dataType(123);
    expect(res).toEqual(FilterTypeCategories.Numeric);
  });

  it('returns date type', () => {
    const res = dataType(new Date('01/01/2025'));
    expect(res).toEqual(FilterTypeCategories.Date);
  });

  it('returns String type', () => {
    const res = dataType('abc');
    expect(res).toEqual(FilterTypeCategories.String);
  });

  it('returns Boolean type', () => {
    let res = dataType(true);
    expect(res).toEqual(FilterTypeCategories.Boolean);

    res = dataType(false);
    expect(res).toEqual(FilterTypeCategories.Boolean);
  });

  it('returns Other types', () => {
    let res = dataType({});
    expect(res).toEqual('object');

    res = dataType(() => {
      return 1;
    });
    expect(res).toEqual('function');
  });
});
