import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import change from './change';
import view from './view';

import routing from './organisation.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardOrganisation';

angular
  .module(moduleName, [
    change,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    view,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
