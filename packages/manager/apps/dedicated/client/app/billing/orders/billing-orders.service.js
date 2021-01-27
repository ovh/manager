import forOwn from 'lodash/forOwn';

export default /* @ngInject */ function BillingOrders(
  $http,
  $q,
  $cacheFactory,
  OvhHttp,
) {
  const self = this;
  let currentTimePromise;
  const cache = {
    orders: 'UNIVERS_BILLING_ORDERS',
    order: 'UNIVERS_BILLING_ORDER',
    orderStatus: 'UNIVERS_BILLING_ORDER_STATUS',
    orderBill: 'UNIVERS_BILLING_ORDER_BILL',
    orderBillDetails: 'UNIVERS_BILLING_ORDER_BILL_DETAILS',
  };

  this.init = function init() {
    currentTimePromise = $http
      .get('/auth/time', { serviceType: 'apiv6' })
      .then((result) => parseInt(result.data, 10))
      .then((timestamp) => moment(timestamp));
  };

  this.getOrders = function getOrders(opts) {
    if (opts.forceRefresh) {
      self.clearCache();
    }
    return OvhHttp.get('/me/order', {
      rootPath: 'apiv7',
      cache: cache.orders,
    });
  };

  this.getOrder = function getOrder(orderId) {
    const propertiesPromise = OvhHttp.get('/me/order/{id}', {
      rootPath: 'apiv7',
      urlParams: {
        id: orderId,
      },
      cache: cache.order,
    });

    return $q
      .all({
        properties: propertiesPromise,
        currentTime: currentTimePromise,
      })
      .then((results) => {
        const order = results.properties;
        order.canRetract = moment(order.retractionDate || 0).isAfter(
          results.currentTime,
        );
        return order;
      });
  };

  this.getOrderBill = function getOrderBill(orderId) {
    return OvhHttp.get('/me/order/{id}/associatedObject', {
      rootPath: 'apiv7',
      urlParams: { id: orderId },
      cache: cache.orderBill,
    })
      .then((associatedObject) => {
        if (associatedObject.type === 'Bill') {
          return associatedObject.id;
        }
        return false;
      })
      .catch(() => false)
      .then((billId) => {
        if (!billId) {
          return false;
        }

        return OvhHttp.get('/me/bill/{billId}', {
          rootPath: 'apiv7',
          urlParams: { billId },
          cache: cache.orderBillDetails,
        });
      });
  };

  this.getOrderPayment = function getOrderPayment(orderId) {
    return OvhHttp.get('/me/order/{id}/payment', {
      rootPath: 'apiv7',
      urlParams: { id: orderId },
      cache: cache.orderBill,
    }).catch(() => null);
  };

  this.retractOrder = function retractOrder(orderId, reason = 'other') {
    return OvhHttp.post('/me/order/{id}/retraction', {
      rootPath: 'apiv6',
      urlParams: { id: orderId },
      data: {
        reason,
      },
    });
  };

  this.clearCache = function clearCache() {
    forOwn(cache, (cacheName) => {
      const cacheInstance = $cacheFactory.get(cacheName);
      if (cacheInstance) {
        cacheInstance.removeAll();
      }
    });
  };

  this.init();
}
