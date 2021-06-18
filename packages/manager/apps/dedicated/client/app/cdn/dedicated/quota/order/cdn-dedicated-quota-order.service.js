export default /* @ngInject */ function cdnDedicatedOrderQuota(OvhHttp) {
  this.getOrderQuotaInformations = (serviceName) =>
    OvhHttp.get('/sws/dedicated/cdn/{serviceName}/order/quota', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
    });

  this.orderQuota = (serviceName, quantity, duration) =>
    OvhHttp.post(`/order/cdn/dedicated/{serviceName}/quota/${duration}`, {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        quota: quantity,
      },
    });
}
