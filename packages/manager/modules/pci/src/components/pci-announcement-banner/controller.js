export default class NewRegionBannerComponentController {
  /* @ngInject */
  constructor(atInternet, ovhFeatureFlipping) {
    this.atInternet = atInternet;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.disableRegionLink = false;
  }

  $onInit() {
    const pciAnnouncementBannerId = 'public-cloud:pci-announcement-banner';
    return this.ovhFeatureFlipping
      .checkFeatureAvailability(pciAnnouncementBannerId)
      .then((newRegionFeature) =>
        newRegionFeature.isFeatureAvailable(pciAnnouncementBannerId),
      )
      .then((status) => {
        if (status) this.trackImpression();
        this.canDisplayPciAnnouncementBanner = status;
      });
  }

  getTrackingBody() {
    return {
      campaignId: '[Manager_PCI_Banner_Beta_PublicCloud]',
      creation: `[${this.getStateName().replace(/\./g, '::')}]`,
    };
  }

  trackImpression() {
    this.atInternet.trackImpression(this.getTrackingBody());
  }

  trackClickImpression() {
    this.atInternet.trackClickImpression({
      click: this.getTrackingBody(),
    });
  }

  onActivationRegionLinkClick() {
    this.trackClickImpression();
    this.onGoToRegion();
  }
}
