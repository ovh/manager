import React from 'react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsCheckbox } from '@ovhcloud/ods-components/checkbox/react';
import { OsdsCheckboxButton } from '@ovhcloud/ods-components/checkbox-button/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_CHECKBOX_BUTTON_SIZE } from '@ovhcloud/ods-components/checkbox-button';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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
    <OsdsCheckbox
      checked={isChecked}
      name={`checkbox-${type}-${toFilterValue(label)}`}
      onOdsCheckedChange={(event: CustomEvent) =>
        onCheckboxChange(type, toFilterValue(label), event)
      }
      data-tracking={`filter::${type}::${toFilterValue(label)}`}
    >
      <OsdsCheckboxButton
        size={ODS_CHECKBOX_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        <span slot="end">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
          >
            {label} {resultsNumber}
          </OsdsText>
        </span>
      </OsdsCheckboxButton>
    </OsdsCheckbox>
  );
};

export default FilterItem;
