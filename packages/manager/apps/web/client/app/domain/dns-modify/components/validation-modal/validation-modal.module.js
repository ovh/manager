import angular from 'angular';
import validationModalComponent from './validation-modal.component';

const moduleName = 'webDomainDnsModifyValidationModalModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('webDomainDnsModifyValidationModal', validationModalComponent)
  .run(/* @ngTranslationsInject:json */);

export default moduleName;
