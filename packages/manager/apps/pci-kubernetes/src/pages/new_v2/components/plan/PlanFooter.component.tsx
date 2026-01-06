import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { PciCard } from '@/components/pciCard/PciCard.component';

export function PlanTileFooter({
  content,
  price,
  isFreePlan,
  disabled,
}: {
  content: string;
  price: number | null;
  isFreePlan: boolean;
  disabled: boolean;
}) {
  const { t } = useTranslation(['add', 'stepper', 'flavor-billing']);
  const { getFormattedHourlyCatalogPrice, getFormattedMonthlyCatalogPrice } = useCatalogPrice(5);
  const hasValidPrice = typeof price === 'number';
  const hourlyPrice = hasValidPrice ? getFormattedHourlyCatalogPrice(price) : null;

  const monthlyPrice = hasValidPrice
    ? getFormattedMonthlyCatalogPrice(convertHourlyPriceToMonthly(price))
    : null;

  if (disabled)
    return (
      <div className="mt-auto min-h-10 w-full rounded-b-md border-none bg-[--ods-color-neutral-100]" />
    );

  return (
    <PciCard.Footer className="-m-6 mt-auto w-full rounded-b-md border-none bg-[--ods-color-primary-100] p-6 pt-0">
      {isFreePlan ? (
        <p className="m-0 p-4 pb-0 text-xl text-[--ods-color-primary-600]">
          <strong>{t(content)}</strong>
        </p>
      ) : (
        <div className="px-4 pt-6 ">
          {hourlyPrice && (
            <div className="">
              <Text preset="small" color="text" className="font-semibold">
                {t('kube_add_plan_footer_starting_from')}
              </Text>
              <Text preset="heading-4" color="primary" className=" text-[--ods-color-primary-600]">
                {hourlyPrice}
              </Text>
            </div>
          )}
          {monthlyPrice && (
            <Text preset="small" color="text" className="block">
              {t('kube_add_plan_footer_starting_from_month')} {monthlyPrice}
            </Text>
          )}
        </div>
      )}
    </PciCard.Footer>
  );
}
