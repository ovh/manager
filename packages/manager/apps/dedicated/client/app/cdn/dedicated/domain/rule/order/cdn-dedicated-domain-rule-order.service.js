export default /* @ngInject */ function cdnDedicatedOrderRule(OvhHttp) {
  this.getCacherulePrices = (serviceName) =>
    OvhHttp.get('/sws/dedicated/cdn/{serviceName}/prices/cacherules', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
    });

  /*
   * get the cache rules orders for the cdn.
   */
  this.getCacheruleOrders = function getCacheruleOrders(serviceName, quantity) {
    return OvhHttp.get('/sws/dedicated/cdn/{serviceName}/order/cacherules', {
      rootPath: '2api',
      urlParams: {
        serviceName,
        quantity,
      },
      params: {
        quantity,
      },
    });
  };

  /*
   * Order cache rules for the cdn.
   */
  this.orderCacherules = (serviceName, quantity, duration) =>
    OvhHttp.post('/order/cdn/dedicated/{serviceName}/cacheRule/{duration}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        duration,
      },
      data: {
        cacheRule: quantity,
      },
    });
}
