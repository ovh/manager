import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerPciStoragesContainersAddDataEncryption';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('pciProjectStoragesDataEncryption', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
