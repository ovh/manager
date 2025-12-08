export default class DeleteModalController {
  /* @ngInject */
  constructor(coreConfig) {
    this.isUSRegion = coreConfig.isRegion('US');
  }
}
