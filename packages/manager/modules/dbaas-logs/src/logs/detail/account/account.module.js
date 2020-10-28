import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import password from './password/password.module';
import service from './logs-account.service';
import setup from './setup/setup.module';

const moduleName = 'ovhManagerDbaasLogsDetailAccount';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    password,
    setup,
  ])
  .service('LogsAccountService', service);

export default moduleName;
