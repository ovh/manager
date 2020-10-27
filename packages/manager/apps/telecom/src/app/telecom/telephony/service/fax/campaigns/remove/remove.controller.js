import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyServiceFaxCampaignsRemoveCtrl(
  $q,
  $stateParams,
  $timeout,
  $uibModalInstance,
  OvhApiTelephony,
  campaign,
) {
  const self = this;

  self.loading = {
    removeCampaign: false,
  };

  self.removed = false;

  self.campaign = angular.copy(campaign);

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.remove = function remove() {
    self.loading.removeCampaign = true;

    return $q
      .all([
        OvhApiTelephony.Fax()
          .Campaigns()
          .v6()
          .delete({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            id: self.campaign.id,
          }).$promise,
        $timeout(angular.noop, 1000),
      ])
      .then(
        () => {
          self.loading.removeCampaign = false;
          self.removed = true;

          return $timeout(self.close, 1500);
        },
        (error) =>
          self.cancel({
            type: 'API',
            message: get(error, 'data.message'),
          }),
      );
  };

  self.cancel = function cancel(message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function close() {
    return $uibModalInstance.close(true);
  };

  /* -----  End of ACTIONS  ------*/
}
