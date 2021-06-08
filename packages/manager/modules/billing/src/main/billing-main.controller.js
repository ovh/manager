export default class BillingMainCtrl {
  /* @ngInject */
  constructor(coreConfig, isPayAsYouGoAvailable) {
    this.coreConfig = coreConfig;
    this.isPayAsYouGoAvailable = isPayAsYouGoAvailable;
  }
}
