import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import {
  useCatalogPrice,
  convertHourlyPriceToMonthly,
} from '@ovh-ux/manager-react-components';
import { TVolumePricing } from '@/api/api.types';

export type TPriceEstimateProps = {
  volumeCapacity: number;
  pricing: TVolumePricing;
};

export default function PriceEstimate({
  volumeCapacity,
  pricing,
}: TPriceEstimateProps) {
  const { t } = useTranslation('volume-edit');
  const { getFormattedCatalogPrice } = useCatalogPrice(3, {
    hideTaxLabel: true,
  });
  const priceEstimate = useMemo(
    () => convertHourlyPriceToMonthly(pricing.price * volumeCapacity),
    [pricing, volumeCapacity],
  );
  return (
    <OdsText color="text">
      {t('pci_projects_project_storages_blocks_add_submit_price_text', {
        price: getFormattedCatalogPrice(priceEstimate),
      })}
    </OdsText>
  );
}
