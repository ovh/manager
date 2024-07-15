import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsChipAttribute } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type StatusComponentProps = {
  statusGroup: string;
  status: string;
  className?: string;
};
export default function StatusComponent({
  statusGroup,
  status,
  className,
}: Readonly<StatusComponentProps>) {
  const { t } = useTranslation('new');
  const [chipAttribute, setChipAttribute] = useState<OdsChipAttribute>({
    color: ODS_THEME_COLOR_INTENT.info,
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
        break;
    }
  }, [statusGroup]);

  return (
    <OsdsChip
      {...chipAttribute}
      className={`w-fit ${className}`}
      data-testid="StatusComponent_chip"
    >
      {t(`pci_projects_project_workflow_instance_status_${status}`)}
    </OsdsChip>
  );
}
