export default class BillingMainCtrl {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    isPayAsYouGoAvailable,
    isPolandAccount,
    isTelephonyAvailable,
    guides,
    trackClick,
  ) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.isPayAsYouGoAvailable = isPayAsYouGoAvailable;
    this.isTelephonyAvailable = isTelephonyAvailable;
    this.guides = guides;
    this.trackClick = trackClick;
    this.isPolandAccount = isPolandAccount;
  }

  descriptionOfHeading() {
    return this.coreConfig.getRegion() !== 'US'
      ? this.$translate.instant('billing_main_description')
      : '';
  }
}
