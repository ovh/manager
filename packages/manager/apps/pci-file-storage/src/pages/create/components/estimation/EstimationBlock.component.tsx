import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/muk';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectShareSpecPricing } from '@/pages/create/view-model/shareCatalog.view-model';

export const EstimationBlock = () => {
  const { t } = useTranslation(['create', 'order-price']);

  const { control } = useFormContext<CreateShareFormValues>();
  const [specName, size, microRegion] = useWatch({
    control,
    name: ['shareData.specName', 'shareData.size', 'shareData.microRegion'],
  });

  const select = useMemo(
    () => selectShareSpecPricing(specName, microRegion),
    [specName, microRegion],
  );

  const { data: pricing } = useShareCatalog<{
    price: number;
    interval: string;
  } | null>({
    select,
  });

  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice();

  const hourlyPrice = pricing ? pricing.price * size : 0;
  const monthlyPrice = convertHourlyPriceToMonthly(hourlyPrice);
  const formattedPrice = getFormattedMonthlyCatalogPrice(monthlyPrice);

  return (
    <section className="flex flex-col gap-4">
      <Text preset="heading-3">{t('create:estimation.title')}</Text>
      <Text preset="paragraph">
        <Trans
          i18nKey="create:estimation.amount"
          values={{ amount: formattedPrice }}
          components={{ b: <b /> }}
        />
      </Text>
    </section>
  );
};
