import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import credentialBanner from '../../../../components/user-credential-banner';

import component from './component';

const moduleName = 'ovhManagerPciStoragesContainersAddCreateLinkedUser';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui', credentialBanner])
  .component('pciProjectStoragesCreateLinkedUser', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
