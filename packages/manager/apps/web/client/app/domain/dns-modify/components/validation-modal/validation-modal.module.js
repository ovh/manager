import angular from 'angular';
import template from './validation-modal.html';

const moduleName = 'validationModalModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('validationModal', {
    template,
    bindings: {
      modifiedDnsList: '<',
      closeValidationModal: '&',
      applyConfiguration: '&',
      isValidationModalOpened: '<',
    },
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
