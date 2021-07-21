import { convertLanguageFromOVHToBCP47 } from '@ovh-ux/manager-config';

export default class Pricing {
  constructor({ duration, price, pricingMode }, locale) {
    Object.assign(this, {
      duration,
      price,
      pricingMode,
    });

    this.locale = locale;

    this.price.text = price.text || this.getPriceAsText();

    this.monthlyPriceValue =
      this.price.value / moment.duration(this.duration).asMonths();
  }

  getPriceAsText(price = this.price.value) {
    return Intl.NumberFormat(convertLanguageFromOVHToBCP47(this.locale), {
      style: 'currency',
      currency: this.price.currencyCode,
      currencyDisplay: 'narrowSymbol',
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

  getDiff(pricing, duration) {
    const priceDiff =
      this.monthlyPriceValue * duration - pricing.monthlyPriceValue * duration;
    return this.format(priceDiff);
  }
}
