import React from 'react';
import { HStack, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { Filter, FilterComparator } from '@/api/filters';

export type FilterListProps = {
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
};

function getFilterComparatorLabel(comparator: FilterComparator) {
  switch (comparator) {
    case FilterComparator.Includes:
      return 'includes';
    case FilterComparator.StartsWith:
      return 'starts with';
    case FilterComparator.EndsWith:
      return 'ends with';
    case FilterComparator.IsEqual:
      return 'is equal to';
    case FilterComparator.IsDifferent:
      return 'is not equal to';
    case FilterComparator.IsLower:
      return 'is lower than';
    case FilterComparator.IsHigher:
      return 'is higher than';
    case FilterComparator.IsBefore:
      return 'is before';
    case FilterComparator.IsAfter:
      return 'is after';
    default:
      return '';
  }
}

export default function FilterList({
  filters,
  onChange,
}: FilterListProps): JSX.Element {
  const removeFilter = (toRemove: Filter) => {
    onChange(filters.filter((f) => f !== toRemove));
  };
  return (
    <HStack>
      {filters.map((filter) => (
        <Tag key={filter.key}>
          <TagLabel>{`${filter.label} ${getFilterComparatorLabel(
            filter.comparator,
          )} ${filter.value}`}</TagLabel>
          <TagCloseButton onClick={() => removeFilter(filter)} />
        </Tag>
      ))}
    </HStack>
  );
}
