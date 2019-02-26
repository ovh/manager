import isNumber from 'lodash/isNumber';

export default /* @ngInject */ ($filter, CucCurrencyService) => (value, intervalParam) => {
  let interval = intervalParam;
  if (!isNumber(interval)) {
    interval = 1;
  }

  const symbol = CucCurrencyService.getCurrentCurrency();
  return $filter('currency')((value / interval) / 100000000, symbol);
};
