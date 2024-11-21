import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TRegion } from '@/api/hook/useRegions';

export const LabelComponent = ({
  item,
  isItemSelected,
}: {
  item: TRegion;
  isItemSelected: boolean;
}): JSX.Element => (
  <div className="p-4 text-center">
    <OsdsText
      size={isItemSelected ? ODS_TEXT_SIZE._500 : ODS_TEXT_SIZE._400}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {item.microName}
    </OsdsText>
  </div>
);
