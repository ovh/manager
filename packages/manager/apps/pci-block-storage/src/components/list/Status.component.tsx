import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE, OdsChipAttribute } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type StatusComponentProps = {
  statusGroup: string;
  status: string;
};
export default function StatusComponent({
  statusGroup,
  status,
}: Readonly<StatusComponentProps>) {
  const { i18n, t } = useTranslation();
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

  const getStatusLabel = (st: string) =>
    i18n.exists(`common:pci_projects_project_storages_blocks_status_${st}`)
      ? t(`pci_projects_project_storages_blocks_status_${st}`)
      : '';

  return (
    <OsdsChip
      {...chipAttribute}
      className="w-fit"
      size={ODS_CHIP_SIZE.sm}
      data-testid="StatusComponent_chip"
    >
      {getStatusLabel(statusGroup) || status}
    </OsdsChip>
  );
}
