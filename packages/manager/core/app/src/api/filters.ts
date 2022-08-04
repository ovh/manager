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
  label?: string;
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
