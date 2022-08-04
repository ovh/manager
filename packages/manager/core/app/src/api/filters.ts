export enum FilterComparator {
  Includes,
  StartsWith,
  EndsWith,
  IsEqual,
  IsDifferent,
  IsLower,
  IsHigher,
  IsBefore,
  IsAfter,
}

export type Filter = {
  key: string;
  value: string;
  comparator: FilterComparator;
  label?: string;
};
