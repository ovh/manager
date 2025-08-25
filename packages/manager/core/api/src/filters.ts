export enum FilterComparator {
  Includes = 'includes',
  StartsWith = 'starts_with',
  EndsWith = 'ends_with',
  IsEqual = 'is_equal',
  IsDifferent = 'is_different',
  IsLower = 'is_lower',
  IsHigher = 'is_higher',
  IsBefore = 'is_before',
  IsAfter = 'is_after',
  IsIn = 'is_in',
  TagEquals = 'EQ',
  TagNotEqual = 'NEQ',
  TagExists = 'EXISTS',
  TagNotExists = 'NEXISTS',
}

export type Filter = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
  type?: FilterTypeCategories;
  tagKey?: string;
};

export enum FilterTypeCategories {
  Numeric = 'Numeric',
  String = 'String',
  Date = 'Date',
  Boolean = 'Boolean',
  Options = 'Options',
  Tags = 'Tags',
}

export const FilterCategories = {
  Numeric: [
    FilterComparator.IsEqual,
    FilterComparator.IsDifferent,
    FilterComparator.IsLower,
    FilterComparator.IsHigher,
  ],
  String: [
    FilterComparator.Includes,
    FilterComparator.StartsWith,
    FilterComparator.EndsWith,
    FilterComparator.IsEqual,
    FilterComparator.IsDifferent,
  ],
  Date: [
    FilterComparator.IsEqual,
    FilterComparator.IsDifferent,
    FilterComparator.IsBefore,
    FilterComparator.IsAfter,
  ],
  Boolean: [FilterComparator.IsEqual, FilterComparator.IsDifferent],
  Options: [FilterComparator.IsEqual, FilterComparator.IsDifferent],
  Tags: [
    FilterComparator.TagEquals,
    FilterComparator.TagNotEqual,
    FilterComparator.TagExists,
    FilterComparator.TagNotExists,
  ],
};

export function applyFilters<T>(items: T[] = [], filters: Filter[] = []) {
  return items.filter((item) => {
    let keep = true;
    filters.forEach((filter) => {
      const value = item[filter.key as keyof T];
      const comp = filter.value as string;
      switch (filter.comparator) {
        case FilterComparator.Includes:
          keep = keep && `${value}`.toLowerCase().includes(comp.toLowerCase());
          break;
        case FilterComparator.StartsWith:
          keep = keep && `${value}`.toLowerCase().startsWith(comp.toLowerCase());
          break;
        case FilterComparator.EndsWith:
          keep = keep && `${value}`.toLowerCase().endsWith(comp.toLowerCase());
          break;
        case FilterComparator.IsEqual:
          if (filter.type === FilterTypeCategories.Date) {
            keep =
              keep &&
              new Date(`${value}`).setHours(0, 0, 0, 0) === new Date(comp).setHours(0, 0, 0, 0);
          } else {
            keep = keep && `${value}`.toLowerCase() === comp.toLowerCase();
          }
          break;
        case FilterComparator.IsDifferent:
          if (filter.type === FilterTypeCategories.Date) {
            keep =
              keep &&
              new Date(`${value}`).setHours(0, 0, 0, 0) !== new Date(comp).setHours(0, 0, 0, 0);
          } else {
            keep = keep && `${value}`.toLowerCase() !== comp.toLowerCase();
          }
          break;
        case FilterComparator.IsLower:
          keep = keep && Number(value) < Number(comp);
          break;
        case FilterComparator.IsHigher:
          keep = keep && Number(value) > Number(comp);
          break;
        case FilterComparator.IsBefore:
          keep = keep && new Date(`${value}`) < new Date(comp);
          break;
        case FilterComparator.IsAfter:
          keep = keep && new Date(`${value}`) > new Date(comp);
          break;
        case FilterComparator.IsIn:
          keep = keep && !!(filter.value as string[]).find((i) => i === `${value}`);
          break;
        default:
          break;
      }
    });
    return keep;
  });
}

export function transformTagsFiltersToQuery(filters: Filter[] = []): string {
  const queryObject: Record<string, Array<{ operator: string; value?: string }>> = {};

  const tagFilters = filters.filter(({ type }) => type === FilterTypeCategories.Tags);

  if (!tagFilters.length) return '';

  tagFilters.forEach(({ comparator: operator, tagKey, value }) => {
    if (!queryObject[tagKey]) {
      queryObject[tagKey] = [];
    }

    const query: { operator: string; value?: string } = {
      operator,
    };

    if (value) {
      query.value = value as string;
    }

    queryObject[tagKey].push(query);
  });

  return JSON.stringify(queryObject);
}
