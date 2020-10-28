import angular from 'angular';

import '@ovh-ux/ng-ovh-telecom-universe-components';

import component from './modem-acsBackend.component';

const moduleName = 'ovhManagerTelecomPackXdslModemACS';

angular
  .module(moduleName, ['ngOvhTelecomUniverseComponents'])
  .component('modemAcsBackend', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
