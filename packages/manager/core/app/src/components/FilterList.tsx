import React from 'react';
import { useTranslation } from 'react-i18next';
import { HStack, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { Filter } from '@/api/filters';

export type FilterListProps = {
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
};

export default function FilterList({
  filters,
  onChange,
}: FilterListProps): JSX.Element {
  const { t } = useTranslation('common');
  const removeFilter = (toRemove: Filter) => {
    onChange(filters.filter((f) => f !== toRemove));
  };
  return (
    <HStack>
      {filters.map((filter, index) => (
        <Tag key={`${filter.key}-${index}`}>
          <TagLabel>{`${filter.label} ${t(`filter_${filter.comparator}`)} ${
            filter.value
          }`}</TagLabel>
          <TagCloseButton onClick={() => removeFilter(filter)} />
        </Tag>
      ))}
    </HStack>
  );
}
