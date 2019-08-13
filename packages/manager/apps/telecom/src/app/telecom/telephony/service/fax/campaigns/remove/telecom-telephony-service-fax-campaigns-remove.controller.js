angular.module('managerApp').controller('TelecomTelephonyServiceFaxCampaignsRemoveCtrl', function ($q, $stateParams, $timeout, $uibModalInstance, OvhApiTelephony, campaign) {
  const self = this;

  self.loading = {
    removeCampaign: false,
  };

  self.removed = false;

  self.campaign = angular.copy(campaign);

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.remove = function () {
    self.loading.removeCampaign = true;

    return $q.all([
      OvhApiTelephony.Fax().Campaigns().v6().delete({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        id: self.campaign.id,
      }).$promise,
      $timeout(angular.noop, 1000),
    ]).then(() => {
      self.loading.removeCampaign = false;
      self.removed = true;

      return $timeout(self.close, 1500);
    }, error => self.cancel({
      type: 'API',
      message: _.get(error, 'data.message'),
    }));
  };

  self.cancel = function (message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function () {
    return $uibModalInstance.close(true);
  };

  /* -----  End of ACTIONS  ------*/
});
