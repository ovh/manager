export default class DatacenterExtraConfiguration {
  /* @ngInject */
  $onInit() {
    this.firstExtraConfiguration = this.datacenter.getFirstExtraConfiguration();
  }
}
