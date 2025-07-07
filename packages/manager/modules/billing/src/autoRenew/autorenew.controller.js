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
    const region = this.coreConfig.getRegion();
    const description = this.$translate.instant('billing_description');
    if (region === 'US') return description;

    const details = this.$translate.instant('billing_description_details');
    return `${description} ${details}`;
  }
}
