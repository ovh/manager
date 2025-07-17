import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { BottomSectionItem } from './useDashboardSections.hook';

interface BillingItemProps {
  item: BottomSectionItem;
  isLoading: boolean;
}

export default function BillingItem({ item, isLoading }: BillingItemProps) {
  const { t } = useTranslation('home');

  if (isLoading) {
    return (
      <div className="flex justify-between items-start">
        <div className="flex-1 text-[var(--ods-color-text)] space-y-2">
          {/* Label skeleton */}
          <div className="space-y-1">
            <OdsSkeleton className="h-5 w-32" />
            <OdsSkeleton className="h-4 w-48" />
          </div>
          {/* Price skeleton */}
          <OdsSkeleton className="h-6 w-20" />
          {/* "Valid until" skeleton */}
          <OdsSkeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start">
      <div className="flex-1 text-[var(--ods-color-text)]">
        {item.label && (
          <div
            className="font-semibold text-sm"
            aria-label={t('voucher_name_aria')}
          >
            {item.label}
          </div>
        )}
        {item.description && (
          <div className="text-sm" aria-label={t('voucher_description_aria')}>
            {item.description}
          </div>
        )}
        {item.price && (
          <div
            className="font-bold text-lg"
            aria-label={t('available_balance_aria')}
          >
            {item.price}
          </div>
        )}
        {item.validUntil && (
          <div className="text-xs" aria-label={t('expiration_date_aria')}>
            {item.validUntil}
          </div>
        )}
      </div>
    </div>
  );
}
