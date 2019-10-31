export default class VpsCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    console.log('Hello', this.$translate.instant('world'));
  }
}
