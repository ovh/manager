export default class XdslModemTemplateConfigModalCtrl {
  /* @ngInject */
  constructor($uibModalInstance, data) {
    this.$uibModalInstance = $uibModalInstance;
    this.title = data.title;
    this.question = data.question;
  }
}
