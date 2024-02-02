import angular from 'angular';
import component from './domain-operation.component';
import routing from './domain-operation.routes';
import service from './domain-operation.service';

const moduleName = 'ovhManagerDomainOperation';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('domainOperation', component)
  .config(routing)
  .service('domainOperationService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
