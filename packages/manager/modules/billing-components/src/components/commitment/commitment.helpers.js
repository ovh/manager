import { Pricing } from '@ovh-ux/manager-models';

export const computeDiscount = (pricingModes, savings, userLocale) => {
  const upfront = pricingModes.find((commitment) => commitment.isUpfront());
  const periodic = pricingModes.find((commitment) => commitment.isPeriodic());

  let upfrontSavings;
  let discount;
  let periodicTotalPrice;

  if (upfront && periodic) {
    const { duration } = periodic;
    const {
      pricing: { price },
    } = upfront;
    periodicTotalPrice = Number.parseFloat(
      periodic.totalPrice.value.toFixed(2),
    );

    const savedAmount = periodic.getPriceDiff(upfront).value;
    discount = ((savedAmount / periodic.totalPrice.value) * 100).toFixed(2);
    const totalSavings = savedAmount + (savings?.value || 0);

    const pricing = new Pricing(
      {
        duration,
        price: {
          currencyCode: price.currencyCode,
          value: totalSavings,
        },
      },
      userLocale,
    );

    upfrontSavings = {
      amountSaved: pricing.getPriceAsText(),
      amountToPay: {
        text: upfront.totalPrice.text,
        value: upfront.totalPrice.value,
      },
    };
  }

  return {
    periodicTotalPrice,
    discount,
    upfrontSavings,
  };
};
