import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import './logs-streams.less';

import add from './add/add.module';
import archives from './archives/archives.module';
import alerts from './alerts/alerts.module';
import component from './streams.component';
import follow from './follow/follow.module';
import home from './home/home.module';
import routing from './streams.routing';
import service from './logs-streams.service';

const moduleName = 'ovhManagerDbaasLogsDetailStreams';

angular
  .module(moduleName, [
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
