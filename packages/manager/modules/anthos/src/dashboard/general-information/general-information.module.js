import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './general-information.component';
import routing from './general-information.routing';

import renameService from './rename-service';
import orderHost from './order-host';
import orderPublicIPs from './order-public-ips';

const moduleName = 'ovhManagerAnthosDashboardGeneralInformation';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ui.router',
    renameService,
    orderHost,
    orderPublicIPs,
  ])
  .config(routing)
  .component('anthosDashboardGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
