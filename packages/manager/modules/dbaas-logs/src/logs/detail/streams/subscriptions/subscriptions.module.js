import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './subscriptions.component';
import routing from './subscriptions.routing';
import service from './streams-subscriptions.service';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsSubscriptions';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .service('LogsStreamsSubscriptionsService', service)
  .component('dbaasLogsDetailStreamsSubscriptions', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
