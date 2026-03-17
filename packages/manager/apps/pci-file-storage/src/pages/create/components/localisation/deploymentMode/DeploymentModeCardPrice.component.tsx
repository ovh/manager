import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { useCatalogPrice } from '@ovh-ux/muk';

import { TDeploymentModePrice } from '@/pages/create/view-model/shareCatalog.view-model';

export const DeploymentModeCardPrice = ({
  monthlyPrice,
}: Readonly<{ monthlyPrice: TDeploymentModePrice | null }>) => {
  const { t } = useTranslation(['create', 'order-price']);
  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice();

  if (!monthlyPrice) return null;

  const formattedPrice = getFormattedMonthlyCatalogPrice(monthlyPrice.value);
  const unit = `${t('order-price:order_catalog_price_tax_excl_label', { price: '' }).trim()}/${t('order-price:order_catalog_price_interval_month')}/${t('create:units.giga_octet')}`;

  return (
    <Text preset="span" className="mt-2 text-sm text-[--ods-color-primary-700]">
      {t('create:localisation.deploymentMode.leastPrice', {
        price: formattedPrice,
        unit,
      })}
    </Text>
  );
};
