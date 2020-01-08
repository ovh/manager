angular.module('managerApp').controller(
  'XdslModemTemplateConfigModalCtrl',
  class XdslModemTemplateConfigModalCtrl {
    /* @ngInject */
    constructor($uibModalInstance, data) {
      this.$uibModalInstance = $uibModalInstance;
      this.title = data.title;
      this.question = data.question;
    }
  },
);
