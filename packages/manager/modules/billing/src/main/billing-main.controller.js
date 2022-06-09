export default class BillingMainCtrl {
  /* @ngInject */
  constructor($translate, coreConfig, isPayAsYouGoAvailable) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.isPayAsYouGoAvailable = isPayAsYouGoAvailable;
  }

  descriptionOfHeading() {
    return this.coreConfig.getRegion() !== 'US'
      ? this.$translate.instant('billing_main_description')
      : '';
  }
}
