import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

export const GroupLabelComponent = ({
  groupName,
  isGroupSelected,
  isMobile,
}: {
  groupName: string;
  isGroupSelected: boolean;
  isMobile: boolean;
}) => {
  const { t: tRegionsList } = useTranslation('regions-list');

  const shouldBeBold = isMobile || (isGroupSelected && !isMobile);

  return (
    <div className="max-w-full p-4">
      <OsdsText
        size={shouldBeBold ? ODS_TEXT_SIZE._500 : ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="overflow-hidden whitespace-nowrap text-ellipsis"
      >
        {groupName || tRegionsList('pci_project_regions_list_continent_all')}
      </OsdsText>
    </div>
  );
};
