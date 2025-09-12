import { describe, it } from 'vitest';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { comparatorFn } from '../filterAndSort.utils';

describe('comparatorFn Function', () => {
  it('compares Numeric type', () => {
    // ascending order
    let res = comparatorFn(FilterTypeCategories.Numeric, '10', '20', false);
    expect(res < 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.Numeric, '20', '10', false);
    expect(res > 0).toBeTruthy();

    // descending order
    res = comparatorFn(FilterTypeCategories.Numeric, '10', '20', true);
    expect(res > 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.Numeric, '20', '10', true);
    expect(res < 0).toBeTruthy();

    // equal with ascending order
    res = comparatorFn(FilterTypeCategories.Numeric, '10', '10', false);
    expect(res === 0).toBeTruthy();

    // equal with descending order
    res = comparatorFn(FilterTypeCategories.Numeric, '10', '10', true);
    expect(res === 0).toBeTruthy();
  });

  it('compares Date type', () => {
    // ascending order
    let res = comparatorFn(
      FilterTypeCategories.Date,
      '01/01/2025',
      '02/01/2025',
      false,
    );
    expect(res < 0).toBeTruthy();
    res = comparatorFn(
      FilterTypeCategories.Date,
      '02/01/2025',
      '01/01/2025',
      false,
    );
    expect(res > 0).toBeTruthy();

    // descending order
    res = comparatorFn(
      FilterTypeCategories.Date,
      '01/01/2025',
      '02/01/2025',
      true,
    );
    expect(res > 0).toBeTruthy();
    res = comparatorFn(
      FilterTypeCategories.Date,
      '02/01/2025',
      '01/01/2025',
      true,
    );
    expect(res < 0).toBeTruthy();

    // equal with ascending order
    res = comparatorFn(
      FilterTypeCategories.Numeric,
      '01/01/2025',
      '01/01/2025',
      false,
    );
    expect(res === 0).toBeTruthy();

    // equal with descending order
    res = comparatorFn(
      FilterTypeCategories.Numeric,
      '01/01/2025',
      '01/01/2025',
      true,
    );
    expect(res === 0).toBeTruthy();
  });

  it('compares String type', () => {
    // ascending order
    let res = comparatorFn(FilterTypeCategories.String, 'ABC', 'XYZ', false);
    expect(res < 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.String, 'XYZ', 'ABC', false);
    expect(res > 0).toBeTruthy();

    // descending order
    res = comparatorFn(FilterTypeCategories.String, 'ABC', 'XYZ', true);
    expect(res > 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.String, 'XYZ', 'ABC', true);
    expect(res < 0).toBeTruthy();

    // equal with ascending order
    res = comparatorFn(FilterTypeCategories.String, 'ABC', 'ABC', false);
    expect(res === 0).toBeTruthy();

    // equal with descending order
    res = comparatorFn(FilterTypeCategories.String, 'ABC', 'ABC', true);
    expect(res === 0).toBeTruthy();
  });

  it('compares Boolean type', () => {
    // ascending order
    let res = comparatorFn(
      FilterTypeCategories.Boolean,
      'true',
      'false',
      false,
    );
    expect(res > 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.Boolean, 'false', 'true', false);
    expect(res < 0).toBeTruthy();

    // descending order
    res = comparatorFn(FilterTypeCategories.Boolean, 'true', 'false', true);
    expect(res < 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.Boolean, 'false', 'true', true);
    expect(res > 0).toBeTruthy();

    // equal with ascending order
    res = comparatorFn(FilterTypeCategories.Boolean, 'true', 'true', false);
    expect(res === 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.Boolean, 'false', 'false', false);
    expect(res === 0).toBeTruthy();

    // equal with descending order
    res = comparatorFn(FilterTypeCategories.Boolean, 'true', 'true', true);
    expect(res === 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.Boolean, 'false', 'false', true);
    expect(res === 0).toBeTruthy();
  });

  it('compares other type', () => {
    const res = comparatorFn(
      FilterTypeCategories.Tags,
      'test1',
      'test2',
      false,
    );
    expect(res < 0).toBeTruthy();
  });

  it('compares empty values', () => {
    let res = comparatorFn(FilterTypeCategories.String, '', 'test', false);
    expect(res < 0).toBeTruthy();

    res = comparatorFn(FilterTypeCategories.String, 'test', '', false);
    expect(res < 0).toBeTruthy();
  });
});
