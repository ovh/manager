import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { useCatalogPrice } from '@ovh-ux/manager-react-components';

import { PciCard } from '@/components/pciCard/PciCard.component';

type TPlanFooterProps = {
  content: string;
  priceExclVat: number | null;
  priceInclVat: number | null;
  isFreePlan: boolean;
  disabled: boolean;
};

export function PlanTileFooter({
  content,
  priceExclVat,
  priceInclVat,
  isFreePlan,
  disabled,
}: TPlanFooterProps) {
  const { t } = useTranslation(['add', 'order-price']);
  const { getTextPrice, getFormattedMonthlyCatalogPrice } = useCatalogPrice(4);

  const formattedPriceExclVat = priceExclVat ? getTextPrice(priceExclVat) : null;
  const formattedPriceInclVat = priceInclVat ? getFormattedMonthlyCatalogPrice(priceInclVat) : null;

  const exclVatLabel = `${t('order-price:order_catalog_price_tax_excl_label', { price: '' })} / ${t('order-price:order_catalog_price_interval_month')}`;

  if (disabled)
    return (
      <div className="mt-auto min-h-10 w-full rounded-b-md border-none bg-[--ods-color-neutral-100]" />
    );

  return (
    <PciCard.Footer className="-m-6 mt-auto w-full rounded-b-md border-none bg-[--ods-color-primary-100] p-6">
      {isFreePlan ? (
        <Text className="text-xl text-[--ods-color-primary-500]">
          <strong>{t(content)}</strong>
        </Text>
      ) : (
        <div className="flex flex-col">
          {formattedPriceExclVat && (
            <>
              <Text preset="caption" className="font-bold">
                {t('kube_add_plan_footer_starting_from')}
              </Text>
              <Text preset="caption" className="text-xl text-[--ods-color-primary-500]">
                <strong>{formattedPriceExclVat}</strong>
              </Text>
              <Text preset="caption">{exclVatLabel}</Text>
            </>
          )}
          {formattedPriceInclVat && (
            <Text preset="caption">
              {t('kube_add_plan_footer_starting_from_month')} {formattedPriceInclVat}
            </Text>
          )}
        </div>
      )}
    </PciCard.Footer>
  );
}
