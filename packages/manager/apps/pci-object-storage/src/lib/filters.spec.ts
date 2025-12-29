import { describe, it, expect } from 'vitest';
import {
  FilterComparator,
  FilterCategories,
  applyFilters,
  Filter,
} from './filters';

const items = [
  { name: 'Alice', age: 30, city: 'Paris', date: '2023-01-01' },
  { name: 'Bob', age: 25, city: 'Berlin', date: '2022-12-31' },
  { name: 'Charlie', age: 35, city: 'London', date: '2023-01-02' },
];

describe('FilterComparator', () => {
  it('should contain all expected comparators', () => {
    expect(FilterComparator.Includes).toBe('includes');
    expect(FilterComparator.StartsWith).toBe('starts_with');
    expect(FilterComparator.EndsWith).toBe('ends_with');
    expect(FilterComparator.IsEqual).toBe('is_equal');
    expect(FilterComparator.IsDifferent).toBe('is_different');
    expect(FilterComparator.IsLower).toBe('is_lower');
    expect(FilterComparator.IsHigher).toBe('is_higher');
    expect(FilterComparator.IsBefore).toBe('is_before');
    expect(FilterComparator.IsAfter).toBe('is_after');
    expect(FilterComparator.IsIn).toBe('is_in');
  });
});

describe('FilterCategories', () => {
  it('should have correct categories', () => {
    expect(FilterCategories.Options).toEqual([
      FilterComparator.IsEqual,
      FilterComparator.IsDifferent,
    ]);
    expect(FilterCategories.Numeric).toContain(FilterComparator.IsLower);
    expect(FilterCategories.String).toContain(FilterComparator.Includes);
    expect(FilterCategories.Date).toEqual([
      FilterComparator.IsBefore,
      FilterComparator.IsAfter,
    ]);
  });
});

describe('applyFilters', () => {
  it('should filter by Includes', () => {
    const filters: Filter[] = [
      { key: 'city', value: 'par', comparator: FilterComparator.Includes },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[0]]);
  });

  it('should filter by StartsWith', () => {
    const filters: Filter[] = [
      { key: 'name', value: 'A', comparator: FilterComparator.StartsWith },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[0]]);
  });

  it('should filter by EndsWith', () => {
    const filters: Filter[] = [
      { key: 'name', value: 'e', comparator: FilterComparator.EndsWith },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[0], items[2]]);
  });

  it('should filter by IsEqual', () => {
    const filters: Filter[] = [
      { key: 'age', value: '25', comparator: FilterComparator.IsEqual },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[1]]);
  });

  it('should filter by IsDifferent', () => {
    const filters: Filter[] = [
      { key: 'city', value: 'Paris', comparator: FilterComparator.IsDifferent },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[1], items[2]]);
  });

  it('should filter by IsLower', () => {
    const filters: Filter[] = [
      { key: 'age', value: '30', comparator: FilterComparator.IsLower },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[1]]);
  });

  it('should filter by IsHigher', () => {
    const filters: Filter[] = [
      { key: 'age', value: '30', comparator: FilterComparator.IsHigher },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[2]]);
  });

  it('should filter by IsBefore', () => {
    const filters: Filter[] = [
      {
        key: 'date',
        value: '2023-01-01',
        comparator: FilterComparator.IsBefore,
      },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[1]]);
  });

  it('should filter by IsAfter', () => {
    const filters: Filter[] = [
      {
        key: 'date',
        value: '2023-01-01',
        comparator: FilterComparator.IsAfter,
      },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[2]]);
  });

  it('should filter by IsIn', () => {
    const filters: Filter[] = [
      {
        key: 'city',
        value: ['Paris', 'London'],
        comparator: FilterComparator.IsIn,
      },
    ];
    const result = applyFilters(items, filters);
    expect(result).toEqual([items[0], items[2]]);
  });

  it('should return all items if filters is empty', () => {
    expect(applyFilters(items, [])).toEqual(items);
  });

  it('should return empty array if items is empty', () => {
    expect(
      applyFilters(
        [],
        [{ key: 'name', value: 'A', comparator: FilterComparator.StartsWith }],
      ),
    ).toEqual([]);
  });

  it('should support nested keys', () => {
    const nestedItems = [
      { user: { info: { name: 'Alice' } } },
      { user: { info: { name: 'Bob' } } },
    ];
    const filters: Filter[] = [
      {
        key: 'user.info.name',
        value: 'Alice',
        comparator: FilterComparator.IsEqual,
      },
    ];
    expect(applyFilters(nestedItems, filters)).toEqual([nestedItems[0]]);
  });

  it('should support array index in key', () => {
    const arrayItems = [
      { tags: [{ name: 'foo' }, { name: 'bar' }] },
      { tags: [{ name: 'baz' }] },
    ];
    const filters: Filter[] = [
      {
        key: 'tags[1].name',
        value: 'bar',
        comparator: FilterComparator.IsEqual,
      },
    ];
    expect(applyFilters(arrayItems, filters)).toEqual([arrayItems[0]]);
  });
});
