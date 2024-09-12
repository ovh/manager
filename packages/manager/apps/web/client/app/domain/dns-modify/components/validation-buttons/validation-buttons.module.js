import angular from 'angular';
import validationButtonsComponent from './validation-buttons.component';

const moduleName = 'webDomainDnsModifyValidationButtonsModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('webDomainDnsModifyValidationButtons', validationButtonsComponent)
  .run(/* @ngTranslationsInject:json */);

export default moduleName;
