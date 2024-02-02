import { useTranslation } from 'react-i18next';

interface PriceProps {
  priceInUcents: number;
  taxInUcents: number;
  decimals: number;
}
const Price = ({ priceInUcents, taxInUcents, decimals = 2 }: PriceProps) => {
  const { t } = useTranslation('common');
  // TODO: handle languages (both display and user subsidiary)
  const unit = '€';
  const ucentToEur = 100_000_000;
  const price = priceInUcents / ucentToEur;
  const priceWithTax = (priceInUcents + taxInUcents) / ucentToEur;
  const formatPrice = (value: number) => {
    // Using toFixed to get 3 decimals and convert to string
    let formattedPrice = value.toFixed(decimals);

    // Removing trailing zeros
    formattedPrice = formattedPrice.replace(/(\.\d*?[1-9])?0+$/, '$1');

    // Ensure at least two decimals
    if (!formattedPrice.includes('.')) {
      formattedPrice += '.00';
    } else if (formattedPrice.split('.')[1].length === 1) {
      formattedPrice += '0';
    }

    // If the result is an empty string, set it to '0.00'
    if (formattedPrice === '.' || formattedPrice === '') {
      formattedPrice = '0.00';
    }

    return formattedPrice;
  };
  return (
    <div>
      <span className="font-bold">
        {t('pricing_ht', { price: formatPrice(price), unit })}
      </span>
      <span className="text-xs mx-2">
        ({t('pricing_ttc', { price: formatPrice(priceWithTax), unit })})
      </span>
    </div>
  );
};

export default Price;
