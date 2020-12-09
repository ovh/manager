import constant from './telecom-dashboard.constant';

export default /* @ngInject */ function (OvhApiMeVipStatus, TucToastError) {
  const self = this;

  self.loading = {
    vip: false,
  };

  self.expressLiteOrder = constant.orderExpressLite;
  self.isVip = false;

  function init() {
    self.loading.vip = true;
    return OvhApiMeVipStatus.v6()
      .get()
      .$promise.then((vipStatus) => {
        self.isVip = vipStatus;
      })
      .catch((err) => new TucToastError(err, 'telecom_dashboard_auth_failed'))
      .finally(() => {
        self.loading.vip = false;
      });
  }

  init();
}
