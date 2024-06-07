import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

interface DeleteConstraintWarningMessageProps {
  hasSnapshot: boolean;
  isAttached: boolean;
}

export default function DeleteConstraintWarningMessage({
  hasSnapshot,
  isAttached,
}: Readonly<DeleteConstraintWarningMessageProps>) {
  const { t } = useTranslation('delete');
  if (!hasSnapshot && !isAttached) {
    return null;
  }
  return (
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
        {hasSnapshot &&
          !isAttached &&
          t(
            'pci_projects_project_storages_blocks_block_delete_error_should_snapshots',
          )}
        {!hasSnapshot &&
          isAttached &&
          t(
            'pci_projects_project_storages_blocks_block_delete_error_should_detach',
          )}
        {hasSnapshot && isAttached && (
          <>
            {t(
              'pci_projects_project_storages_blocks_block_delete_error_should_multiple',
            )}
            <ul>
              <li>
                {t(
                  'pci_projects_project_storages_blocks_block_delete_error_detach',
                )}
              </li>
              <li>
                {t(
                  'pci_projects_project_storages_blocks_block_delete_error_delete_snapshots',
                )}
              </li>
            </ul>
          </>
        )}
      </OsdsText>
    </OsdsMessage>
  );
}
