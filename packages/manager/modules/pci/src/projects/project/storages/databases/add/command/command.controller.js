export default class CommandCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
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
