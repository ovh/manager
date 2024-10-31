import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_CHIP_SIZE, ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { userIsActive } from '@/utils';

export default function Status({ status }: { status: string }) {
  const { t } = useTranslation('common');
  return (
    <OsdsChip
      inline
      className="whitespace-nowrap"
      size={ODS_CHIP_SIZE.sm}
      color={
        userIsActive(status)
          ? ODS_TEXT_COLOR_INTENT.success
          : ODS_TEXT_COLOR_INTENT.warning
      }
    >
      {t(`pci_projects_project_users_status_${status.toLowerCase()}`)}
    </OsdsChip>
  );
}
