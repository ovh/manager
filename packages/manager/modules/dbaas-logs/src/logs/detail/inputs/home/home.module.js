import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './home.component';
import info from './info/info.module';
import routing from './home.routing';

const moduleName = 'ovhManagerDbaasLogsDetailInputsHome';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    info,
  ])
  .config(routing)
  .component('dbaasLogsDetailInputsHome', component);

export default moduleName;
