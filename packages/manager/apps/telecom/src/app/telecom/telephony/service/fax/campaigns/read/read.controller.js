import assign from 'lodash/assign';

export default /* @ngInject */ function TelecomTelephonyServiceFaxCampaignsReadCtrl(
  $stateParams,
  $q,
  $uibModalInstance,
  OvhApiTelephony,
  campaign,
  TucToastError,
) {
  const self = this;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  function fetchCampaignDetail(theCampaign) {
    return OvhApiTelephony.Fax()
      .Campaigns()
      .v6()
      .getDetail({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        id: theCampaign.id,
      }).$promise;
  }

  /* -----  End of HELPERS  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.close = function close() {
    return $uibModalInstance.close(true);
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.loading = {
      init: false,
    };

    self.campaign = angular.copy(campaign);

    self.details = {
      todo: null,
      success: null,
      failed: null,
    };

    self.list = {
      todo: true,
      success: true,
      failed: false,
    };

    self.loading.init = true;
    return fetchCampaignDetail(campaign)
      .then((details) => assign(self.details, details))
      .catch((err) => {
        if (err.status === 400) {
          return $q.reject(err);
        }
        return new TucToastError(err);
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
