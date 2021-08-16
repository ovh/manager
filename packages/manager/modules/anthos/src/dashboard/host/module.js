import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import hostTable from './host-table';
import orderHost from './order';
import reinstallHost from './reinstall';
import remove from './remove';
import restartHost from './restart';
import routing from './routing';
import setState from './set-state';

const moduleName = 'ovhManagerAnthosDashboardHost';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    hostTable,
    orderHost,
    reinstallHost,
    remove,
    restartHost,
    setState,
  ])
  .component('anthosHost', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
