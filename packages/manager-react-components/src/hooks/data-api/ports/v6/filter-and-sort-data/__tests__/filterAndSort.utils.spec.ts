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
    expect(res == 0).toBeTruthy();

    // equal with descending order
    res = comparatorFn(FilterTypeCategories.Numeric, '10', '10', true);
    expect(res == 0).toBeTruthy();
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
    expect(res == 0).toBeTruthy();

    // equal with descending order
    res = comparatorFn(
      FilterTypeCategories.Numeric,
      '01/01/2025',
      '01/01/2025',
      true,
    );
    expect(res == 0).toBeTruthy();
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
    expect(res == 0).toBeTruthy();

    // equal with descending order
    res = comparatorFn(FilterTypeCategories.String, 'ABC', 'ABC', true);
    expect(res == 0).toBeTruthy();
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
    expect(res == 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.Boolean, 'false', 'false', false);
    expect(res == 0).toBeTruthy();

    // equal with descending order
    res = comparatorFn(FilterTypeCategories.Boolean, 'true', 'true', true);
    expect(res == 0).toBeTruthy();
    res = comparatorFn(FilterTypeCategories.Boolean, 'false', 'false', true);
    expect(res == 0).toBeTruthy();
  });

  it('compares other type', () => {
    let res = comparatorFn(FilterTypeCategories.Tags, 'test1', 'test2', false);
    expect(res < 0).toBeTruthy();
  });

  it('compares empty values', () => {
    let res = comparatorFn(FilterTypeCategories.String, '', 'test', false);
    expect(res < 0).toBeTruthy();

    res = comparatorFn(FilterTypeCategories.String, 'test', '', false);
    expect(res < 0).toBeTruthy();
  });
});

// describe('filterBySearch Function', () => {
//   const items = [
//     {
//       id: 1,
//       name: 'Europe',
//     },
//     {
//       id: 2,
//       name: 'Asia',
//     },
//     {
//       id: 3,
//       name: 'North America',
//     },
//     {
//       id: 4,
//       name: 'South America',
//     },
//     {
//       id: 5,
//       name: 'Africa',
//     },
//     {
//       id: 6,
//       name: 'Antartica',
//     },
//     {
//       id: 7,
//       name: 'Australia',
//     }
//   ];

//   const filters = [{
//     key: 'name',
//     value: '',
//     comparator: FilterComparator.Includes,
//   }];

//   it('search with emtpy string', () => {
//     const res = filterBySearch(items, filters, '');
//     expect(res.length).toBe(7);
//   });

//   it('search with emtpy filters', () => {
//     const res = filterBySearch(items, [], 'America');
//     expect(res.length).toBe(7);
//   });

//   it('search with text', () => {
//     const searchText = 'America';
//     const res = filterBySearch(items, filters, searchText);
//     expect(res.length).toBe(2);
//     res.forEach((item) => {
//       expect(item.name).toContain(searchText);
//     })
//   });

//   it('should not include items with (null or undefined) value', () => {
//     const searchText = 'America';
//     items.push({ id: 8, name: null });
//     items.push({ id: 9, name: undefined });
//     const res = filterBySearch(items, filters, searchText);
//     expect(res.length).toBe(2);
//     res.forEach((item) => {
//       expect(item.id).not.toBe(8);
//       expect(item.id).not.toBe(9);
//     });
//   });
// });
