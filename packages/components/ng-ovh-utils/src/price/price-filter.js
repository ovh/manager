angular.module('ua.price').filter('price',
['translator',
function (translator) {
    "use strict";

    var frenchTouch = {
        TTCOnly : false,
        HTOnly  : false,
        withTTC : true
    };

    var usTouch = {
        TTCOnly : false,
        HTOnly  : true,
        withTTC : false
    };

    var deutchTouch = {
        TTCOnly : true,
        HTOnly  : false,
        withTTC : true
    };

    var showTaxes = {
        CA : usTouch,
        WE : usTouch,
        WS : usTouch,
        QC : usTouch,
        DE : deutchTouch,
        FI : deutchTouch,
        SN : deutchTouch,
        CZ : frenchTouch,
        ES : frenchTouch,
        FR : frenchTouch,
        GB : frenchTouch,
        IE : frenchTouch,
        IT : frenchTouch,
        LT : frenchTouch,
        MA : frenchTouch,
        NL : frenchTouch,
        PL : frenchTouch,
        PT : frenchTouch,
        TN : frenchTouch
    };

    function format(price, country, frequency) {
        country = country || 'FR';

        var taxes = showTaxes[country];
        if (price.withTax.value !== 0) {
            if (taxes.TTCOnly) {
                return "<b class=\"red\">" + price.withTax.text + "</b>";
            } else {
                if (taxes.HTOnly) {
                    return "<b class=\"red\">" + price.withoutTax.text + "</b>";
                }
                if (frequency === 'yearly') {
                    return "<b class=\"red\">" + translator.tr('price_ht_label', [price.withoutTax.text]) + "<small>" + translator.tr('price_label_yearly') +
                           "</small></b><i class=\"small\"> (" + translator.tr('price_ttc_label', [price.withTax.text]) + "<small>" + translator.tr('price_label_yearly') + "</small>)</i>";
                }
                return "<b class=\"red\">" + translator.tr('price_ht_label', [price.withoutTax.text]) +
                       "</b><i class=\"small\"> (" + translator.tr('price_ttc_label', [price.withTax.text]) + ")</i>";
            }
        }
        return '<b class=\"red\">' +  translator.tr('price_free') + '</b>';
    }

    return function (price, ovhSubsidiary, frequency) {
        if (price !== undefined ) {
            return format(price, ovhSubsidiary, frequency);
        }

        return "<span/>";
    };
}]);
