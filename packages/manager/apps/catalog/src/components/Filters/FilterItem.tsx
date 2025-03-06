import React from 'react';
import { OdsText, OdsCheckbox } from '@ovhcloud/ods-components/react';
import { toFilterValue } from '@/utils/utils';

interface FilterItemProps {
  label?: string;
  count?: number;
  type: 'category' | 'universe';
  isChecked: boolean;
  onCheckboxChange: (
    type: 'category' | 'universe',
    label: string,
    event: CustomEvent,
  ) => void;
}

const FilterItem: React.FC<FilterItemProps> = ({
  label,
  count,
  type,
  isChecked,
  onCheckboxChange,
}) => {
  const resultsNumber = count ? ` (${count})` : '';

  return (
    <OdsCheckbox
      name={`checkbox-${type}-${toFilterValue(label)}`}
      data-tracking={`filter::${type}::${toFilterValue(label)}`}
    >
      <span slot="end">
        <OdsText>
          {label} {resultsNumber}
        </OdsText>
      </span>
    </OdsCheckbox>
  );
};

export default FilterItem;
