import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { useCatalogPrice } from '@ovh-ux/muk';

export const EstimationBlock = () => {
  const { t } = useTranslation(['create', 'order-price']);

  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice();

  const formattedPrice = getFormattedMonthlyCatalogPrice(0);

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
