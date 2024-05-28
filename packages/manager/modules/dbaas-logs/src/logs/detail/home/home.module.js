import angular from 'angular';

import '@ovh-ux/manager-core';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import account from './account/account.module';
import aliases from '../aliases/aliases.module';
import component from './home.component';
import formatsports from './formatsports/formatsports.module';
import routing from './home.routing';
import service from './logs-home.service';

const moduleName = 'ovhManagerDbaasLogsDetailHome';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    account,
    aliases,
    formatsports,
    ngOvhChart,
  ])
  .config(routing)
  .service('LogsHomeService', service)
  .component('dbaasLogsDetailHome', component);

export default moduleName;
