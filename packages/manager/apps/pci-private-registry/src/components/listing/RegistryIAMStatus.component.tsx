import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

const RegistryIAMStatus = ({ enabled }: Readonly<{ enabled: boolean }>) => {
  const { t } = useTranslation();

  return (
    <OsdsChip
      color={
        enabled
          ? ODS_THEME_COLOR_INTENT.success
          : ODS_THEME_COLOR_INTENT.default
      }
      className="w-fit"
      data-testid="registryIamAthenticationStatus_chip"
    >
      <span className="whitespace-nowrap">
        {t(
          `private_registry_common_status_${enabled ? 'ENABLED' : 'DISABLED'}`,
        )}
      </span>
    </OsdsChip>
  );
};

export default RegistryIAMStatus;
