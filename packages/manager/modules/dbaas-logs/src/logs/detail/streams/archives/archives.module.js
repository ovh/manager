import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './archives.component';
import routing from './archives.routing';
import service from './streams-archives.service';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsArchives';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .service('LogsStreamsArchivesService', service)
  .component('dbaasLogsDetailStreamsArchives', component);

export default moduleName;
