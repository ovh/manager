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
}

export type Filter = {
  key: string;
  value: string;
  comparator: FilterComparator;
};

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
};

export function applyFilters<T>(items: T[] = [], filters: Filter[] = []) {
  return items.filter((item) => {
    let keep = true;
    filters.forEach((filter) => {
      const value = item[filter.key as keyof T];
      switch (filter.comparator) {
        case FilterComparator.Includes:
          keep =
            keep &&
            `${value}`.toLowerCase().includes(filter.value.toLowerCase());
          break;
        case FilterComparator.StartsWith:
          keep =
            keep &&
            `${value}`.toLowerCase().startsWith(filter.value.toLowerCase());
          break;
        case FilterComparator.EndsWith:
          keep =
            keep &&
            `${value}`.toLowerCase().endsWith(filter.value.toLowerCase());
          break;
        case FilterComparator.IsEqual:
          keep =
            keep && `${value}`.toLowerCase() === filter.value.toLowerCase();
          break;
        case FilterComparator.IsDifferent:
          keep =
            keep && `${value}`.toLowerCase() !== filter.value.toLowerCase();
          break;
        case FilterComparator.IsLower:
          keep = keep && Number(value) < Number(filter.value);
          break;
        case FilterComparator.IsHigher:
          keep = keep && Number(value) > Number(filter.value);
          break;
        case FilterComparator.IsBefore:
          keep = keep && new Date(`${value}`) < new Date(filter.value);
          break;
        case FilterComparator.IsAfter:
          keep = keep && new Date(`${value}`) > new Date(filter.value);
          break;
        default:
          break;
      }
    });
    return keep;
  });
}
