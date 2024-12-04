import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

interface RegionLabelProps {
  label: string;
  isSelected?: boolean;
}

export function RegionLabel({ label, isSelected }: Readonly<RegionLabelProps>) {
  return (
    <div className="p-6">
      <OsdsText
        size={isSelected ? ODS_TEXT_SIZE._500 : ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {label}
      </OsdsText>
    </div>
  );
}
