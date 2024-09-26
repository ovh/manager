export default class RbxEolBannerController {
  /* @ngInject */
  constructor(VmacUnavailableBannerService) {
    this.VmacUnavailableBannerService = VmacUnavailableBannerService;
    this.showBanner = false;
  }

  $onInit() {
    this.VmacUnavailableBannerService.isVmacUnavailableForService(
      this.serviceId,
    ).then((isVmacAvailable) => {
      this.showBanner = isVmacAvailable;
    });
  }
}
