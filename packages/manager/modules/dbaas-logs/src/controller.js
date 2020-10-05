export default class DbaasLogsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    console.log('Hello', this.$translate.instant('world'));
  }
}
