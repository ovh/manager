import angular from 'angular';

export default /* @ngInject */ ($translate) => {
  const frenchTouch = {
    TTCOnly: false,
    HTOnly: false,
    withTTC: true,
    withGST: false,
  };

  const usTouch = {
    TTCOnly: false,
    HTOnly: true,
    withTTC: false,
    withGST: false,
  };

  const deutchTouch = {
    TTCOnly: true,
    HTOnly: false,
    withTTC: true,
    withGST: false,
  };

  const asiaTouch = {
    TTCOnly: false,
    HTOnly: false,
    withTTC: false,
    withGST: true,
  };

  const showTaxes = {
    ASIA: asiaTouch,
    AU: asiaTouch,
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
    SG: asiaTouch,
    TN: frenchTouch,
    US: usTouch,
  };

  function format(price, paramCountry, modifier) {
    const country = (angular.isString(paramCountry) && paramCountry) || 'FR';
    const taxes = showTaxes[country];
    if (price.withTax.value !== 0 || modifier === 'verbose') {
      if (taxes.withGST) {
        return `<b class="red">${$translate.instant(
          'price_price_gst_excl_label',
          { price: price.withoutTax.text },
        )}</b><i class="small"> (${$translate.instant(
          'price_price_gst_incl_label',
          { price: price.withTax.text },
        )})</i>`;
      }
      if (taxes.TTCOnly) {
        return `<b class="red">${price.withTax.text}</b>`;
      }
      if (taxes.HTOnly) {
        return `<b class="red">${price.withoutTax.text}</b>`;
      }
      return `<b class="red">${$translate.instant('price_ht_label', {
        price: price.withoutTax.text,
      })}</b><i class="small"> (${$translate.instant('price_ttc_label', {
        price: price.withTax.text,
      })})</i>`;
    }
    return `<b class="red">${$translate.instant('price_free')}</b>`;
  }

  return function priceFilter(price, ovhSubsidiary, modifier) {
    if (price !== undefined) {
      return format(price, ovhSubsidiary, modifier);
    }

    return '<span/>';
  };
};
