export default class PciProjectActivateBannerController {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.trackingName = `${this.trackingPageName}::activate-project`;

    this.atInternet.trackPage({
      name: this.trackingName,
      pciProjectModeParams: { isDiscoveryProject: true },
    });
  }

  onActivateProjectClick() {
    this.trackClick(this.trackingName);
    return this.goToDiscoveryProjectActivationPage();
  }
}
