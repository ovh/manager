import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './follow.component';
import routing from './follow.routing';
import service from './streams-follow.service';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsFollow';

angular
  .module(moduleName, [
    'angular-websocket',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .service('LogsStreamsFollowService', service)
  .component('dbaasLogsDetailStreamsFollow', component);

export default moduleName;
