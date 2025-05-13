import '@ovh-ux/ui-kit';
import angular from 'angular';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerPciStoragesContainersBucketVersioning';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('pciProjectStoragesBucketVersioning', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
