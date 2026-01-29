import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyFaxManagementInformationsCtrl(
  $q,
  $stateParams,
  $translate,
  TelephonyMediator,
  TucToast,
  tucVoipService,
  TucNumberPlans,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.group = null;
  self.fax = null;
  self.plan = null;

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.group = group;
        self.fax = self.group.getFax($stateParams.serviceName);
        self.plan = TucNumberPlans.getPlanByNumber(self.fax);
        tucVoipService
          .fetchSingleService($stateParams.billingAccount, $stateParams.serviceName)
          .then((service) => {
            if (service) {
              self.fax.rio = service.rio;
            }
          })
          .catch(() => null);
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_fax_loading_error'),
            get(error, 'data.message', ''),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  /* -----  End of INITIALIZATION  ------ */
}
