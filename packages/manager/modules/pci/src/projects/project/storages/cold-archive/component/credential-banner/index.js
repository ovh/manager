import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName =
  'ovhManagerPciStoragesContainersAddCreateLinkedUserCredentialBanner';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('pciProjectStoragesUserCredentialBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
