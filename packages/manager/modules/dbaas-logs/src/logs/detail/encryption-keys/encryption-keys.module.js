import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './encryption-keys.component';
import routing from './encryption-keys.routing';
import service from './logs-encryption-keys.service';
import add from './add/add.module';
import home from './home/home.module';

const moduleName = 'ovhManagerDbaasLogsDetailEncryptionKeys';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
    home,
  ])
  .config(routing)
  .service('LogsEncryptionKeysService', service)
  .component('dbaasLogsDetailEncryptionKeys', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
