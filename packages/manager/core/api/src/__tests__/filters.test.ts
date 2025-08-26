import { describe, expect, it } from 'vitest';

import { applyFilters, transformTagsFiltersToQuery } from '../filters';
import { Filter, FilterComparator, FilterTypeCategories } from '../types/filters.type';

describe('applyFilters', () => {
  const testItems = [
    {
      id: 1,
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      active: true,
      date: '2023-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 25,
      email: 'jane@example.com',
      active: false,
      date: '2023-02-20',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      age: 35,
      email: 'bob@example.com',
      active: true,
      date: '2023-03-10',
    },
    {
      id: 4,
      name: 'Alice Brown',
      age: 28,
      email: 'alice@example.com',
      active: false,
      date: '2023-01-05',
    },
  ];

  it('should return all items when no filters are provided', () => {
    const result = applyFilters(testItems, []);
    expect(result).toEqual(testItems);
  });

  it('should return empty array when items is empty', () => {
    const result = applyFilters([], []);
    expect(result).toEqual([]);
  });

  it('should filter by string includes', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'john',
        comparator: FilterComparator.Includes,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(2); // Both "John Doe" and "Bob Johnson" contain "john"
    expect(result.map((item) => item.name)).toEqual(['John Doe', 'Bob Johnson']);
  });

  it('should filter by string starts with', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'j',
        comparator: FilterComparator.StartsWith,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.name)).toEqual(['John Doe', 'Jane Smith']);
  });

  it('should filter by string ends with', () => {
    const filters: Filter[] = [
      {
        key: 'email',
        value: 'example.com',
        comparator: FilterComparator.EndsWith,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(4);
  });

  it('should filter by string equals', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'John Doe',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.name).toBe('John Doe');
  });

  it('should filter by string not equals', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'John Doe',
        comparator: FilterComparator.IsDifferent,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(3);
    expect(result.map((item) => item.name)).not.toContain('John Doe');
  });

  it('should filter by numeric less than', () => {
    const filters: Filter[] = [
      {
        key: 'age',
        value: '30',
        comparator: FilterComparator.IsLower,
        type: FilterTypeCategories.Numeric,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.age)).toEqual([25, 28]);
  });

  it('should filter by numeric greater than', () => {
    const filters: Filter[] = [
      {
        key: 'age',
        value: '30',
        comparator: FilterComparator.IsHigher,
        type: FilterTypeCategories.Numeric,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.age).toBe(35);
  });

  it('should filter by date before', () => {
    const filters: Filter[] = [
      {
        key: 'date',
        value: '2023-02-01',
        comparator: FilterComparator.IsBefore,
        type: FilterTypeCategories.Date,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.date)).toEqual(['2023-01-15', '2023-01-05']);
  });

  it('should filter by date after', () => {
    const filters: Filter[] = [
      {
        key: 'date',
        value: '2023-02-01',
        comparator: FilterComparator.IsAfter,
        type: FilterTypeCategories.Date,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.date)).toEqual(['2023-02-20', '2023-03-10']);
  });

  it('should filter by date equals (same day)', () => {
    const filters: Filter[] = [
      {
        key: 'date',
        value: '2023-01-15',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.Date,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.date).toBe('2023-01-15');
  });

  it('should filter by date not equals', () => {
    const filters: Filter[] = [
      {
        key: 'date',
        value: '2023-01-15',
        comparator: FilterComparator.IsDifferent,
        type: FilterTypeCategories.Date,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(3);
    expect(result.map((item) => item.date)).not.toContain('2023-01-15');
  });

  it('should filter by boolean equals', () => {
    const filters: Filter[] = [
      {
        key: 'active',
        value: 'true',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.Boolean,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.active)).toEqual([true, true]);
  });

  it('should filter by is in array', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: ['John Doe', 'Jane Smith'],
        comparator: FilterComparator.IsIn,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.name)).toEqual(['John Doe', 'Jane Smith']);
  });

  it('should filter by is in array with single value', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: ['John Doe'],
        comparator: FilterComparator.IsIn,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.name).toBe('John Doe');
  });

  it('should apply multiple filters (AND logic)', () => {
    const filters: Filter[] = [
      {
        key: 'age',
        value: '30',
        comparator: FilterComparator.IsHigher,
        type: FilterTypeCategories.Numeric,
      },
      {
        key: 'active',
        value: 'true',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.Boolean,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.name).toBe('Bob Johnson');
  });

  it('should handle case insensitive string comparison', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'JOHN DOE',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.name).toBe('John Doe');
  });

  it('should handle case insensitive includes', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'JOHN',
        comparator: FilterComparator.Includes,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toHaveLength(2); // Both "John Doe" and "Bob Johnson" contain "JOHN" (case insensitive)
    expect(result.map((item) => item.name)).toEqual(['John Doe', 'Bob Johnson']);
  });

  it('should return empty array when no items match filters', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'NonExistent',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
    ];
    const result = applyFilters(testItems, filters);
    expect(result).toEqual([]);
  });

  it('should handle undefined values gracefully', () => {
    const itemsWithUndefined = [
      { id: 1, name: 'John', age: undefined },
      { id: 2, name: 'Jane', age: 25 },
    ];
    const filters: Filter[] = [
      {
        key: 'age',
        value: '30',
        comparator: FilterComparator.IsLower,
        type: FilterTypeCategories.Numeric,
      },
    ];
    const result = applyFilters(itemsWithUndefined, filters);
    expect(result).toHaveLength(1);
    expect(result?.[0]?.name).toBe('Jane');
  });
});

describe('transformTagsFiltersToQuery', () => {
  it('should return empty string when no filters are provided', () => {
    const result = transformTagsFiltersToQuery([]);
    expect(result).toBe('');
  });

  it('should return empty string when no tag filters are provided', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'test',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    expect(result).toBe('');
  });

  it('should transform single tag filter', () => {
    const filters: Filter[] = [
      {
        key: 'tags',
        value: 'production',
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    const expected = JSON.stringify({
      environment: [{ operator: FilterComparator.TagEquals, value: 'production' }],
    });
    expect(result).toBe(expected);
  });

  it('should transform multiple tag filters with same tag key', () => {
    const filters: Filter[] = [
      {
        key: 'tags',
        value: 'production',
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
      {
        key: 'tags',
        value: 'staging',
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    const expected = JSON.stringify({
      environment: [
        { operator: FilterComparator.TagEquals, value: 'production' },
        { operator: FilterComparator.TagEquals, value: 'staging' },
      ],
    });
    expect(result).toBe(expected);
  });

  it('should transform multiple tag filters with different tag keys', () => {
    const filters: Filter[] = [
      {
        key: 'tags',
        value: 'production',
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
      {
        key: 'tags',
        value: 'finance',
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'department',
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    const expected = JSON.stringify({
      environment: [{ operator: FilterComparator.TagEquals, value: 'production' }],
      department: [{ operator: FilterComparator.TagEquals, value: 'finance' }],
    });
    expect(result).toBe(expected);
  });

  it('should handle tag filters without values (exists/not exists)', () => {
    const filters: Filter[] = [
      {
        key: 'tags',
        value: '',
        comparator: FilterComparator.TagExists,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
      {
        key: 'tags',
        value: '',
        comparator: FilterComparator.TagNotExists,
        type: FilterTypeCategories.Tags,
        tagKey: 'department',
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    const expected = JSON.stringify({
      environment: [{ operator: FilterComparator.TagExists }],
      department: [{ operator: FilterComparator.TagNotExists }],
    });
    expect(result).toBe(expected);
  });

  it('should handle mixed tag and non-tag filters', () => {
    const filters: Filter[] = [
      {
        key: 'name',
        value: 'test',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
      {
        key: 'tags',
        value: 'production',
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
      {
        key: 'age',
        value: '30',
        comparator: FilterComparator.IsHigher,
        type: FilterTypeCategories.Numeric,
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    const expected = JSON.stringify({
      environment: [{ operator: FilterComparator.TagEquals, value: 'production' }],
    });
    expect(result).toBe(expected);
  });

  it('should handle tag filters with different operators', () => {
    const filters: Filter[] = [
      {
        key: 'tags',
        value: 'production',
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
      {
        key: 'tags',
        value: 'finance',
        comparator: FilterComparator.TagNotEqual,
        type: FilterTypeCategories.Tags,
        tagKey: 'department',
      },
      {
        key: 'tags',
        value: '',
        comparator: FilterComparator.TagExists,
        type: FilterTypeCategories.Tags,
        tagKey: 'status',
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    const expected = JSON.stringify({
      environment: [{ operator: FilterComparator.TagEquals, value: 'production' }],
      department: [{ operator: FilterComparator.TagNotEqual, value: 'finance' }],
      status: [{ operator: FilterComparator.TagExists }],
    });
    expect(result).toBe(expected);
  });

  it('should handle empty string values', () => {
    const filters: Filter[] = [
      {
        key: 'tags',
        value: '',
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    const expected = JSON.stringify({
      environment: [{ operator: FilterComparator.TagEquals }], // Empty string values are not included
    });
    expect(result).toBe(expected);
  });

  it('should handle undefined values', () => {
    const filters: Filter[] = [
      {
        key: 'tags',
        value: undefined,
        comparator: FilterComparator.TagEquals,
        type: FilterTypeCategories.Tags,
        tagKey: 'environment',
      },
    ];
    const result = transformTagsFiltersToQuery(filters);
    const expected = JSON.stringify({
      environment: [{ operator: FilterComparator.TagEquals, value: undefined }],
    });
    expect(result).toBe(expected);
  });
});
