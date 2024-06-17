import angular from 'angular';
import template from './validation-modal.html';

const moduleName = 'validationModalModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('validationModal', {
    template,
    bindings: {
      modifiedDnsList: '<',
      isUpdating: '<',
      closeValidationModal: '&',
      applyConfiguration: '&',
    },
  })
  .run(/* @ngTranslationsInject:json */);

export default moduleName;
