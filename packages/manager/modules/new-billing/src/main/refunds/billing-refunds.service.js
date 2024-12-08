export default /* @ngInject */ function BillingRefunds($http, $cacheFactory) {
  const billingCache = $cacheFactory('UNIVERS_BILLING_REFUNDS');

  this.getBillingRefunds = function getBillingRefunds({
    count,
    offset,
    date,
    dateTo,
  }) {
    const data = {};

    if (count !== undefined) {
      data.count = count;
    }
    if (offset !== undefined) {
      data.offset = offset;
    }
    if (date) {
      data.date = moment(date)
        .startOf('day')
        .toISOString();
    }
    if (dateTo) {
      data.dateTo = moment(dateTo)
        .endOf('day')
        .toISOString();
    }

    return $http
      .get('/sws/billing/refunds', {
        params: data,
        cache: billingCache,
        serviceType: 'aapi',
      })
      .then((response) => response.data);
  };
}
