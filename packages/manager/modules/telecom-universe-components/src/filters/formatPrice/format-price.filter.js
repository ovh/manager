import angular from 'angular';

export default /* @ngInject */ ($sce, $translate) => function (priceText, options) {
  let additionalTag;
  let formatedPrice;

  // set default values
  const myOptions = angular.extend({
    withoutTax: true,
    additionalText: '',
    addBrackets: false,
  }, options || {});

  const priceTag = `<span class="text-price">${priceText}</span>`;

  if (myOptions.withoutTax) {
    additionalTag = `<span class="price-infos">${$translate.instant('common_monthly_without_tax')}${myOptions.additionalText ? myOptions.additionalText : ''}</span>`;
    formatedPrice = $sce.trustAsHtml([priceTag, additionalTag].join(' '));
  } else {
    formatedPrice = $sce.trustAsHtml(priceTag);
  }

  if (myOptions.addBrackets) {
    return ['(', formatedPrice, ')'].join('');
  }
  return formatedPrice;
};
