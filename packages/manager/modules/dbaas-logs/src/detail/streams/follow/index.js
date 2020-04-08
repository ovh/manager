import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
// eslint-disable-next-line import/no-webpack-loader-syntax
import 'script-loader!angular-websocket/dist/angular-websocket';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './streams-follow.component';
import routing from './streams-follow.routing';
import service from './streams-follow.service';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsFollow';

angular
  .module(moduleName, [
    'angularMoment',
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
