import React from 'react';
import { useTranslation } from 'react-i18next';
import { HStack, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { Filter } from '@ovh-ux/manager-core-api';
import { ListingColumn } from './Listing';

export type ListingFiltersProps<T> = {
  columns: ListingColumn<T>[];
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
};

export default function ListingFilters<T>({
  columns,
  filters,
  onChange,
}: ListingFiltersProps<T>): JSX.Element {
  const { t } = useTranslation('listing');
  const removeFilter = (toRemove: Filter) => {
    onChange(filters.filter((f) => f !== toRemove));
  };
  return (
    <HStack>
      {filters.map((filter, index) => (
        <Tag key={`${filter.key}-${index}`}>
          <TagLabel>{`${
            columns.find(({ key }) => key === filter.key).label
          } ${t(`filter_${filter.comparator}`)} ${filter.value}`}</TagLabel>
          <TagCloseButton onClick={() => removeFilter(filter)} />
        </Tag>
      ))}
    </HStack>
  );
}
