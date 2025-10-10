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
}

export type Filter = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
};

export const FilterCategories = {
  Options: [FilterComparator.IsEqual, FilterComparator.IsDifferent],
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
  Date: [FilterComparator.IsBefore, FilterComparator.IsAfter],
};

export function applyFilters<T>(items: T[] = [], filters: Filter[] = []) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, key) => {
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        return acc && acc[arrayKey] && acc[arrayKey][Number(index)];
      }
      return acc && acc[key];
    }, obj);
  };
  return items.filter((item) => {
    let keep = true;
    filters.forEach((filter) => {
      const value = getNestedValue(item, filter.key);
      const comp = filter.value as string;
      switch (filter.comparator) {
        case FilterComparator.Includes:
          keep = keep && `${value}`.toLowerCase().includes(comp.toLowerCase());
          break;
        case FilterComparator.StartsWith:
          keep =
            keep && `${value}`.toLowerCase().startsWith(comp.toLowerCase());
          break;
        case FilterComparator.EndsWith:
          keep = keep && `${value}`.toLowerCase().endsWith(comp.toLowerCase());
          break;
        case FilterComparator.IsEqual:
          keep = keep && `${value}`.toLowerCase() === comp.toLowerCase();
          break;
        case FilterComparator.IsDifferent:
          keep = keep && `${value}`.toLowerCase() !== comp.toLowerCase();
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
          keep =
            keep && !!(filter.value as string[]).find((i) => i === `${value}`);
          break;
        default:
          break;
      }
    });
    return keep;
  });
}
