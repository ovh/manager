export default /* @ngInject */ function PackHubicActivationCtrl(
  $scope,
  $stateParams,
  OvhApiPackXdslHubic,
  TucToastError,
) {
  const self = this;
  self.hubicList = [];

  self.$onInit = function $onInit() {
    return OvhApiPackXdslHubic.Aapi()
      .query({ packId: $stateParams.packName })
      .$promise.then(
        (data) => {
          self.hubicList = data;
        },
        (err) => new TucToastError(err),
      );
  };
}
