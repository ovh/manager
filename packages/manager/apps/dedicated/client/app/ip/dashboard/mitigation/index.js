import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import statistics from './statistics';
import update from './update';

import routing from './mitigation.routing';
import service from './mitigation.service';

const moduleName = 'ovhManagerDedicatedIpDashboardMitigation';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    statistics,
    'ui.router',
    update,
  ])
  .service('IpDashboardMitigation', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
