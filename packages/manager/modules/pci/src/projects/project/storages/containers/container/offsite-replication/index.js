import '@ovh-ux/ui-kit';
import angular from 'angular';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerPciStoragesContainersOffsiteReplication';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('pciProjectStoragesOffsiteReplication', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
