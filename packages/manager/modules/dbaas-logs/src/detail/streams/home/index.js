import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import addTool from '../../options/addtool';
import component from './logs-streams-home.component';
import routing from './logs-streams-home.routing';
import upgradeQuotaLink from '../../options/upgradequotalink';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsHome';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    addTool,
    upgradeQuotaLink,
  ])
  .config(routing)
  .component('dbaasLogsDetailStreamsHome', component);

export default moduleName;
