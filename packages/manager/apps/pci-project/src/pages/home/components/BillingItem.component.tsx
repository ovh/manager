import { memo } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { DashboardItem } from '@/constants';
import BillingItemSkeleton from './BillingItemSkeleton.component';

type BillingItemProps = {
  item: DashboardItem;
  isLoading: boolean;
};

const BillingItem = memo(function BillingItem({
  item,
  isLoading,
}: BillingItemProps) {
  const { t } = useTranslation('project');

  if (isLoading) {
    return <BillingItemSkeleton />;
  }

  return (
    <div
      className="flex justify-between items-start"
      role="listitem"
      aria-labelledby={t('billing-item-title')}
    >
      <div className="flex-1 text-[var(--ods-color-text)]">
        {item.descriptionTranslationKey && (
          <OdsText
            preset="paragraph"
            className="mb-2"
            aria-label={t('pci_projects_project_voucher_description_aria')}
          >
            {t(item.descriptionTranslationKey)}
          </OdsText>
        )}
        {item.price && (
          <OdsText
            preset="heading-4"
            className="block mb-1"
            aria-label={t('pci_projects_project_available_balance_aria')}
          >
            {item.price}
          </OdsText>
        )}
        {item.validUntil && (
          <OdsText
            preset="caption"
            aria-label={t('pci_projects_project_expiration_date_aria')}
          >
            {item.validUntil}
          </OdsText>
        )}
      </div>
    </div>
  );
});

export default BillingItem;
