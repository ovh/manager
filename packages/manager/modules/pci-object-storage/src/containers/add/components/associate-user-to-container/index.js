import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerPciStoragesContainersAddCreateLinkedUser';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('pciProjectStoragesCreateLinkedUser', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
