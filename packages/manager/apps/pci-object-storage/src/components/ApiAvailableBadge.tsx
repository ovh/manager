import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

export type TApiAvailableBadgeProps = {
  className?: string;
};

export const ApiAvailableBadge = ({
  className = '',
}: TApiAvailableBadgeProps) => {
  const { t } = useTranslation(['dashboard']);
  return (
    <OdsBadge
      size="md"
      color="neutral"
      label={t(
        'dashboard:pci_projects_project_storages_dashboard_object_available_on_api',
      )}
      className={className}
    />
  );
};
