export default /* @ngInject */ ($filter, CucCurrencyService) => (
  value,
  intervalParam,
) => {
  const symbol = CucCurrencyService.getCurrentCurrency();
  return $filter('currency')(
    CucCurrencyService.convertUcentsToCurrency(value, intervalParam),
    symbol,
  );
};
