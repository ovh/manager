import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

export const StackTitleComponent = () => {
  const { t: tRegionsList } = useTranslation('regions-list');
  return (
    <div className="mt-3 mb-6">
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {tRegionsList('pci_project_regions_list_region')}
      </OsdsText>
    </div>
  );
};
