import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';

import add from './add';
import component from './logs-aliases.component';
import home from './home';
import link from './link';
import routing from './logs-aliases.routing';
import service from './logs-aliases.service';

const moduleName = 'ovhManagerDbaasLogsDetailAliases';

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
    home,
    link,
  ])
  .config(routing)
  .service('LogsAliasesService', service)
  .component('dbaasLogsDetailAliases', component);

export default moduleName;
