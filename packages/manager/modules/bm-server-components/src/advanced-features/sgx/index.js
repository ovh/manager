import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import introduction from './introduction';
import manage from './manage';
import status from './status';

import routing from './sgx.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardSgx';

angular
  .module(moduleName, [
    introduction,
    manage,
    'oui',
    'pascalprecht.translate',
    status,
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
