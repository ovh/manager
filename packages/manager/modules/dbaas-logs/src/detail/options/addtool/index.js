import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './logs-add-tool.component';

const moduleName = 'ovhManagerDbaasLogsDetailOptionsAddTool';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dbaasLogsDetailOptionsAddTool', component);

export default moduleName;
