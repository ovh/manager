import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import angular from 'angular';
import component from './operation-table.component';

const moduleName = 'ovhManagerDomainOperationTable';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
  ])
  .component('operationTable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
