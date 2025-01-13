import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';

export const LimitedQuotaBadgeComponent = () => {
  const { t } = useTranslation('quotas');
  return (
    <OdsBadge
      label={t('pci_projects_project_quota_threshold_reached')}
      color="warning"
      className="ml-4 font-bold"
    ></OdsBadge>
  );
};
