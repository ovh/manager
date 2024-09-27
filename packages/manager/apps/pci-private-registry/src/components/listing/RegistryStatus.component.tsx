import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsChipAttribute } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PRIVATE_REGISTRY_STATUS } from '@/constants';

export default function RegistryStatus({
  status,
}: Readonly<{ status: string }>) {
  const { i18n, t } = useTranslation();

  const [chipAttribute, setChipAttribute] = useState<OdsChipAttribute>({
    color: ODS_THEME_COLOR_INTENT.success,
  });

  useEffect(() => {
    switch (status) {
      case PRIVATE_REGISTRY_STATUS.READY:
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.success,
        });
        break;
      case PRIVATE_REGISTRY_STATUS.UPDATING:
      case PRIVATE_REGISTRY_STATUS.RESTORING:
      case PRIVATE_REGISTRY_STATUS.SUSPENDING:
      case PRIVATE_REGISTRY_STATUS.DELETING:
        setChipAttribute({
          color: ODS_THEME_COLOR_INTENT.warning,
        });
        break;
      case PRIVATE_REGISTRY_STATUS.ERROR:
      case PRIVATE_REGISTRY_STATUS.SUSPENDED:
      case PRIVATE_REGISTRY_STATUS.DELETED:
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
  }, [status]);

  const getStatusLabel = (st: string) =>
    i18n.exists(`common:private_registry_common_status_${st}`)
      ? t(`private_registry_common_status_${st}`)
      : '';

  return (
    <OsdsChip
      {...chipAttribute}
      className="w-fit"
      data-testid="registryStatus_chip"
    >
      <span className="whitespace-nowrap">
        {getStatusLabel(status) || status}
      </span>
    </OsdsChip>
  );
}
