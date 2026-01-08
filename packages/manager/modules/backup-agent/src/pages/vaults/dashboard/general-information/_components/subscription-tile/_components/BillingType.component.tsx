import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { CONSUMPTION_MAX_VALUE_IN_TB } from '../SubscriptionTile.component';

export const BillingType = () => {
  const { t } = useTranslation([NAMESPACES.BYTES]);
  const bundleSize = `${CONSUMPTION_MAX_VALUE_IN_TB}${t('unit_size_TB')}`;
  const priceHTText = 'XX,XX €';
  const priceTTCText = 'XX,XX €';

  return (
    <div>
      <OdsText class="block">Bundle - {bundleSize}</OdsText>
      <OdsText className="block [&::part(text)]:font-medium">À partir de</OdsText>
      <OdsText
        className="block [&::part(text)]:font-bold [&::part(text)]:text-[var(--ods-color-primary-500)]"
        color="primary"
      >
        {priceHTText}
      </OdsText>
      <OdsText className="block [&::part(text)]:font-light">HT/mois</OdsText>
      <OdsText className="block [&::part(text)]:font-light">soit {priceTTCText} TTC/mois</OdsText>
      <OdsText className="block [&::part(text)]:font-light">sans engagement</OdsText>
    </div>
  );
};
