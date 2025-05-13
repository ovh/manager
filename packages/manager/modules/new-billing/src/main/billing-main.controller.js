export default class BillingMainCtrl {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    isPayAsYouGoAvailable,
    guides,
    trackClick,
  ) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.isPayAsYouGoAvailable = isPayAsYouGoAvailable;
    this.guides = guides;
    this.trackClick = trackClick;
  }

  descriptionOfHeading() {
    return this.coreConfig.getRegion() !== 'US'
      ? this.$translate.instant('billing_main_description')
      : '';
  }
}
