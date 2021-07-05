export default class OvhManagerNetAppDashboardCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    console.log('Hello', this.$translate.instant('world'));
  }
}
