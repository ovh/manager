import { OdsText } from '@ovhcloud/ods-components/react';

export const BillingType = () => {
  const BundleSize = '100TB';
  const priceHTText = 'XX,XX €';
  const priceTTCText = 'XX,XX €';

  return (
    <div>
      <OdsText class="block">Bundle - {BundleSize}</OdsText>
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
