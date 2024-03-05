import { convertLanguageFromOVHToBCP47 } from '@ovh-ux/manager-config';

export default class Pricing {
  constructor({ duration, price, pricingMode, interval }, locale) {
    Object.assign(this, {
      duration,
      price,
      pricingMode,
      interval,
    });

    this.locale = locale;

    this.price.text = price.text || this.getPriceAsText();
    this.price.maximumFractionDigits = price.maximumFractionDigits || 2;
    this.monthlyPriceValue = this.price.value / this.interval;
  }

  getPriceAsText(price = this.price.value) {
    return Intl.NumberFormat(convertLanguageFromOVHToBCP47(this.locale), {
      style: 'currency',
      currency: this.price.currencyCode,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: this.price.maximumFractionDigits,
    }).format(price);
  }

  format(price = this.price.value) {
    return {
      currencyCode: this.price.currencyCode,
      value: price,
      text: this.getPriceAsText(price),
    };
  }

  get monthlyPrice() {
    return this.format(this.monthlyPriceValue);
  }

  getDiff(pricing, duration, quantity) {
    const priceDiff =
      this.monthlyPriceValue * quantity * duration -
      pricing.monthlyPriceValue * duration;
    return this.format(priceDiff);
  }
}
