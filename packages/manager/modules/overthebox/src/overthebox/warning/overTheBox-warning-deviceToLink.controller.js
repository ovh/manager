export default class OverTheBoxWarningDeviceToLinkCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    $state,
    OvhApiOverTheBox,
    TucToast,
    TucToastError,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$state = $state;
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.parent = this.$scope.OrderOverTheBox;
    this.deviceCount = this.parent.orphanDevices.length;
    if (
      this.parent.orphanDevices.length === 1 &&
      this.parent.unlinkedServices.length === 1
    ) {
      this.link = {
        service: this.parent.unlinkedServices[0].service,
        device: this.parent.orphanDevices[0].deviceId,
      };
    }
    if (
      this.parent.orphanDevices.length !== 1 &&
      this.parent.unlinkedServices.length === 1
    ) {
      this.configService = {
        service: this.parent.unlinkedServices[0].service,
        url: this.$state.href('overTheBoxes.overTheBox.details', {
          serviceName: this.parent.unlinkedServices[0].service,
        }),
      };
    }
    if (
      this.parent.orphanDevices.length !== 1 &&
      this.parent.unlinkedServices.length !== 1
    ) {
      this.unknown = this.parent.unlinkedServices;
    }
  }

  autoLink() {
    if (!this.link) {
      return;
    }
    this.loader = true;
    this.OvhApiOverTheBox.v6()
      .linkDevice(
        {
          serviceName: this.link.service,
        },
        {
          deviceId: this.link.device,
        },
      )
      .$promise.then(() => {
        this.TucToast.success(
          this.$translate.instant('overTheBox_link_device_success'),
        );
      })
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.loader = false;
      });
  }
}
