const frenchTouch = {
  TTCOnly: false,
  HTOnly: false,
  withTTC: true,
};

const usTouch = {
  TTCOnly: false,
  HTOnly: true,
  withTTC: false,
};

const deutchTouch = {
  TTCOnly: true,
  HTOnly: false,
  withTTC: true,
};

const showTaxes = {
  CA: usTouch,
  WE: usTouch,
  WS: usTouch,
  QC: usTouch,
  DE: deutchTouch,
  FI: deutchTouch,
  SN: deutchTouch,
  CZ: frenchTouch,
  ES: frenchTouch,
  FR: frenchTouch,
  GB: frenchTouch,
  IE: frenchTouch,
  IT: frenchTouch,
  LT: frenchTouch,
  MA: frenchTouch,
  NL: frenchTouch,
  PL: frenchTouch,
  PT: frenchTouch,
  TN: frenchTouch,
};

export default /* @ngInject */ function vpsPriceFilter($translate) {
  function format(price, country, frequency) {
    const theCountry = country || 'FR';
    const taxes = showTaxes[theCountry];

    if (price.withTax.value !== 0) {
      if (taxes.TTCOnly) {
        return `<span class="bold">${price.withTax.text}</span>`;
      }
      if (taxes.HTOnly) {
        return `<span class="bold">${price.withoutTax.text}</span>`;
      }
      if (frequency === 'yearly') {
        return `<span class="bold">${$translate.instant('vps_price_ht_label', { price: price.withoutTax.text })}`
          + `<small>${$translate.instant('vps_price_label_yearly')}</small></span> `
          + `<span class="italic small"> (${$translate.instant('vps_price_ttc_label', { price: price.withTax.text })}`
          + `<small>${$translate.instant('vps_price_label_yearly')}</small>)</span>`;
      }
      return `<span class="bold">${$translate.instant('vps_price_ht_label', { price: price.withoutTax.text })}`
        + `</span> <span class="italic small"> (${$translate.instant('vps_price_ttc_label', { price: price.withTax.text })})</span>`;
    }
    return `<span class="bold">${$translate.instant('vps_price_free')}</span>`;
  }

  return (price, ovhSubsidiary, frequency) => {
    if (price) {
      return format(price, ovhSubsidiary, frequency);
    }

    return '<span/>';
  };
}
