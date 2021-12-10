export default /* @ngInject */ function billingOrdersPurchasesService(OvhHttp) {
  this.postPurchaseOrder = function postPurchaseOrder(data) {
    return OvhHttp.post('/me/billing/purchaseOrder', {
      rootPath: 'apiv6',
      data,
    });
  };

  this.putPurchaseOrder = function putPurchaseOrder(id, data) {
    return OvhHttp.put(`/me/billing/purchaseOrder/${id}`, {
      rootPath: 'apiv6',
      data,
    });
  };
}
