import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';

const BillingItemSkeleton = memo(function BillingItemSkeleton() {
  const { t } = useTranslation('project');

  return (
    <div
      className="flex flex-col gap-4 flex-1"
      role="status"
      aria-label={t('pci_project_project_loading_billing_info')}
    >
      <OdsSkeleton className="w-1/3" />
      <OdsSkeleton className="w-1/2" />
      <OdsSkeleton className="w-20" />
      <OdsSkeleton className="w-2/3" />
    </div>
  );
});

export default BillingItemSkeleton;
