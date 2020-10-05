import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-sidebar-menu';
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
    'ngOvhSidebarMenu',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    account,
    aliases,
    formatsports,
  ])
  .config(routing)
  .service('LogsHomeService', service)
  .component('dbaasLogsDetailHome', component);

export default moduleName;
