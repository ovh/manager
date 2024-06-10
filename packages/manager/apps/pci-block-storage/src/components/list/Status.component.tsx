import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsChipAttribute } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type StatusComponentProps = {
  statusGroup: string;
  status: string;
};
export default function StatusComponent({
  statusGroup,
  status,
}: Readonly<StatusComponentProps>) {
  const { t } = useTranslation();
  const [chipAttribute, setChipAttribute] = useState<OdsChipAttribute>({
    color: ODS_THEME_COLOR_INTENT.success,
  });
  useEffect(() => {
    switch (statusGroup) {
      case 'ACTIVE':
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.success,
        });
        break;
      case 'PENDING':
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.warning,
        });
        break;
      case 'ERROR':
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.error,
        });
        break;
      default:
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.info,
        });
        break;
    }
  }, [statusGroup]);
  return (
    <OsdsChip {...chipAttribute} className={'w-fit'}>
      {status === statusGroup
        ? status
        : t(`pci_projects_project_storages_blocks_status_${statusGroup}`)}
    </OsdsChip>
  );
}
