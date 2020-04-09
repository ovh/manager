import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import add from './add';
import deleteModule from './delete';
import update from './update';

import component from './reverse.component';
import routing from './reverse.routing';
import service from './reverse.service';

const moduleName = 'ovhManagerDedicatedIpDashboardReverse';

angular
  .module(moduleName, [
    add,
    deleteModule,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    update,
  ])
  .component('ipDashboardReverse', component)
  .service('IpDashboardReverse', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
