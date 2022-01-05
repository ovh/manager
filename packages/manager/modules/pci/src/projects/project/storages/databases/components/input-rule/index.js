import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './input-rule.component';

const moduleName = 'ovhManagerPciStoragesDatabasesInputRule';

angular
  .module(moduleName, ['oui'])
  .component('inputRule', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
