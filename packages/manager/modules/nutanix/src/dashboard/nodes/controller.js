export default class NutanixDashboardCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.nutanixGuideUrl = '';
  }
}
