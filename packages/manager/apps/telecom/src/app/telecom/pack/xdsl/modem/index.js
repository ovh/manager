import angular from 'angular';

import '@ovh-ux/ng-ovh-telecom-universe-components';

import component from './pack-xdsl-modem.component';
import routing from './pack-xdsl-modem.routing';

const moduleName = 'ovhManagerTelecomPackXdslModem';

angular
  .module(moduleName, ['ngOvhTelecomUniverseComponents'])
  .component('packXdslModem', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
