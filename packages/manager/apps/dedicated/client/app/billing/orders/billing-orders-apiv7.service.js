import forOwn from 'lodash/forOwn';
import map from 'lodash/map';

export default /* @ngInject */ function BillingOrdersApiv7(
  $q,
  $http,
  $cacheFactory,
) {
  const cache = {
    orderQuery: $cacheFactory('UNIVERS_BILLING_ORDERS_APIV7_ORDER_QUERY'),
    status: $cacheFactory('UNIVERS_BILLING_ORDERS_APIV7_STATUS'),
  };

  function getQueryString(params) {
    return map(params, (val, key) =>
      [encodeURIComponent(key), encodeURIComponent(val)].join('='),
    ).join('&');
  }

  this.getExpiredOrderIds = function getExpiredOrderIds() {
    const params = {
      'expirationDate:lt': moment().format(),
    };

    return $http.get(`/me/order?${getQueryString(params)}`, {
      cache: cache.orderQuery,
      serviceType: 'apiv7',
      transformResponse(data, headers, status) {
        if (status !== 200) {
          return data;
        }
        return angular.fromJson(data).map((id) => id.toString());
      },
    });
  };

  this.getOrderIdsByStatus = function getOrderIdsByStatus(opts) {
    const params = { $aggreg: 1 };

    if (opts.statusList && opts.statusList.length > 0) {
      params['value:in'] = opts.statusList.join(',');
    }

    return $http.get(`/me/order/*/status?${getQueryString(params)}`, {
      cache: cache.status,
      serviceType: 'apiv7',
      transformResponse(data, headers, status) {
        if (status !== 200) {
          return data;
        }
        const idFromPathRegex = new RegExp('/me/order/([^/]+)/status');
        const orderStatusInfo = angular.fromJson(data);
        return orderStatusInfo.map((orderStatus) => {
          const orderId = orderStatus.path.match(idFromPathRegex)[1];
          return {
            orderId,
            status: orderStatus.value,
          };
        });
      },
    });
  };

  this.clearCache = function clearCache() {
    forOwn(cache, (cacheInstance) => {
      if (cacheInstance) {
        cacheInstance.removeAll();
      }
    });
  };
}
