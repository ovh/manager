export default class CommandCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    if (!this.data) {
      this.goBack(true);
    }
  }

  cancel() {
    return this.goBack();
  }
}
