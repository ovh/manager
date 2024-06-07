import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

export default function DeleteWarningMessage() {
  const { t } = useTranslation('delete');
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
      size={ODS_TEXT_SIZE._400}
      className={'block mt-6'}
    >
      <OsdsMessage
        color={ODS_THEME_COLOR_INTENT.warning}
        icon={ODS_ICON_NAME.WARNING}
        className="mt-6"
      >
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_block_delete_erase_message')}
        </OsdsText>
      </OsdsMessage>
    </OsdsText>
  );
}
