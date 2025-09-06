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
  value: string | string[] | undefined;
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
