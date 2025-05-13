export default class PciProjectActivateBannerController {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.trackingName = `${this.trackingPageName}::activate-project`;

    this.atInternet.trackPage({
      name: this.trackingName,
    });
  }

  onActivateProjectClick() {
    this.atInternet.trackClick({ name: this.trackingName, type: 'action' });
    return this.onClick();
  }
}
