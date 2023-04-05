import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerPciStoragesComponentsDetachVolumeBanner';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('ovhManagerPciStoragesComponentsDetachVolumeBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
