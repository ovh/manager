import { OdsText } from '@ovhcloud/ods-components/react';

export const BillingType = () => {
  const BundleSize = '100TB';
  const priceHTText = 'XX,XX €';
  const priceTTCText = 'XX,XX €';

  return (
    <>
      <OdsText>Bundle - {BundleSize}</OdsText>
      <OdsText className="[&::part(text)]:font-medium">À partir de</OdsText>
      <OdsText
        className="[&::part(text)]:font-bold [&::part(text)]:text-[var(--ods-color-primary-500)]"
        color="primary"
      >
        {priceHTText}
      </OdsText>
      <OdsText className="[&::part(text)]:font-light">HT/mois</OdsText>
      <OdsText className="[&::part(text)]:font-light">soit {priceTTCText} TTC/mois</OdsText>
      <OdsText className="[&::part(text)]:font-light">sans engagement</OdsText>
    </>
  );
};
