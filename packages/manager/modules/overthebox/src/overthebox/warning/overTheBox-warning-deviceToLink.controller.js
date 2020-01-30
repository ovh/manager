export default /* @ngInject */ function(
  $scope,
  $translate,
  $state,
  OvhApiOverTheBox,
  TucToast,
  TucToastError,
) {
  const parent = $scope.OrderOverTheBox;
  const self = this;

  function init() {
    self.deviceCount = parent.orphanDevices.length;
    if (
      parent.orphanDevices.length === 1 &&
      parent.unlinkedServices.length === 1
    ) {
      self.link = {
        service: parent.unlinkedServices[0].service,
        device: parent.orphanDevices[0].deviceId,
      };
    }
    if (
      parent.orphanDevices.length !== 1 &&
      parent.unlinkedServices.length === 1
    ) {
      self.configService = {
        service: parent.unlinkedServices[0].service,
        url: $state.href('overTheBoxes.overTheBox.details', {
          serviceName: parent.unlinkedServices[0].service,
        }),
      };
    }
    if (
      parent.orphanDevices.length !== 1 &&
      parent.unlinkedServices.length !== 1
    ) {
      self.unknown = parent.unlinkedServices;
    }
  }

  self.autoLink = function autoLink() {
    if (!self.link) {
      return;
    }
    self.loader = true;
    OvhApiOverTheBox.v6()
      .linkDevice(
        {
          serviceName: self.link.service,
        },
        {
          deviceId: self.link.device,
        },
      )
      .$promise.then(
        () => {
          TucToast.success(
            $translate.instant('overTheBox_link_device_success'),
          );
        },
        (error) => new TucToastError(error),
      )
      .finally(() => {
        self.loader = false;
      });
  };

  init();
}
