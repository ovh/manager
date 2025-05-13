import { PRICES_CONFIG } from './partner-preset-price.constants';

export default class AppImagePartnerPresetPriceController {
  $onInit() {
    const { licensing } = this.preset;
    const { multiplier, starting, unit } =
      PRICES_CONFIG[licensing] || PRICES_CONFIG.default;

    this.price = this.preset.prices[this.type].priceInUcents * multiplier;
    this.tax = this.preset.prices[this.type].tax * multiplier;
    this.unit = unit;
    this.starting = starting;
  }
}
