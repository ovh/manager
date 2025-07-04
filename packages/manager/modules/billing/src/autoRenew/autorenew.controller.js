export default class AutorenewCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    if (!this.isAutorenewManagementAvailable) {
      delete this.guides.url.my_services.automatic_renewal;
      this.hideHeaderGuide =
        Object.keys(this.guides.url.my_services).length === 0;
    }
  }

  descriptionOfHeading() {
    return this.coreConfig.getRegion() !== 'US'
      ? this.$translate.instant('billing_description')
      : '';
  }
}
