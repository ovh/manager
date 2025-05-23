import angular from 'angular';
import service from './domain-operation.service';

const moduleName = 'ovhManagerDomainOperation';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .service('domainOperationService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
