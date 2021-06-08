export default /* @ngInject */ function BillingOvhAccount(
  $http,
  $q,
  $cacheFactory,
) {
  const billingAccountCache = $cacheFactory('UNIVERS_BILLING_OVHACCOUNT_LIST');
  const self = this;

  this.getBillingOvhAccount = function getBillingOvhAccount({
    ovhAccount,
    count,
    offset,
    date,
    dateTo,
  }) {
    const data = {};

    if (count != null) {
      data.count = count;
    }
    if (offset != null) {
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
    data.ovhAccount = ovhAccount;

    return $http
      .get('/sws/billing/ovhaccount', {
        params: data,
        serviceType: 'aapi',
      })
      .then((response) => response.data);
  };

  this.getOvhAccount = function getOvhAccount() {
    return $http
      .get('apiv6/me/ovhAccount', {
        cache: billingAccountCache,
      })
      .then((response) => {
        if (angular.isArray(response.data)) {
          return $q.all(
            response.data.map((ovhAccountId) =>
              self.getOvhAccountDetails(ovhAccountId),
            ),
          );
        }
        return response.data;
      });
  };

  this.getOvhAccountDetails = function getOvhAccountDetails(ovhAccountId) {
    return $http
      .get(['apiv6/me/ovhAccount', ovhAccountId].join('/'), {
        cache: billingAccountCache,
      })
      .then((response) => response.data);
  };

  this.putOvhAccountDetails = function putOvhAccountDetails(
    ovhAccountId,
    ovhAccountInfos,
  ) {
    return $http
      .put(['apiv6/me/ovhAccount', ovhAccountId].join('/'), ovhAccountInfos)
      .then((response) => response.data);
  };

  this.creditOvhAccount = function creditOvhAccount(ovhAccountId, amount) {
    return $http
      .post(['apiv6/me/ovhAccount', ovhAccountId, 'creditOrder'].join('/'), {
        amount: Math.round(amount * 100),
      })
      .then((response) => {
        if (response.status < 300) {
          return response;
        }
        return $q.reject(response);
      });
  };

  this.retrieveMoney = (ovhAccountId, amount, bankAccountId) =>
    $http
      .post(['apiv6/me/ovhAccount', ovhAccountId, 'retrieveMoney'].join('/'), {
        amount,
        bankAccountId,
      })
      .then((resp) => resp.data);
}
