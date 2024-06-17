import angular from 'angular';
import template from './validation-buttons.html';

const moduleName = 'validationButtonsModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('validationButtons', {
    template,
    bindings: {
      openValidationModal: '&',
      cancelModifications: '&',
      showCancelModificationsButton: '<',
      canSubmit: '<',
      shouldClearForm: '=',
    },
  })
  .run(/* @ngTranslationsInject:json */);

export default moduleName;
