import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import './logs-streams.less';

import add from './add';
import archives from './archives';
import alerts from './alerts';
import component from './logs-streams.component';
import follow from './follow';
import home from './home';
import routing from './logs-streams.routing';
import service from './logs-streams.service';

const moduleName = 'ovhManagerDbaasLogsDetailStreams';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
    alerts,
    archives,
    follow,
    home,
  ])
  .config(routing)
  .service('LogsStreamsService', service)
  .component('dbaasLogsDetailStreams', component);

export default moduleName;
