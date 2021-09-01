import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './assign-private-ip.routing';
import assignPrivateIp from '../../components/assign-private-ip';

const moduleName = 'ovhManagerAnthosDashboardIPsAssignPrivateIp';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    assignPrivateIp,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
