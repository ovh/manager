import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './home.component';
import routing from './home.routing';
import service from '../logs-encryption-keys.service';
import detail from './detail/detail.module';

const moduleName = 'ovhManagerDbaasLogsDetailEncryptionKeysHome';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    detail,
  ])
  .config(routing)
  .service('LogsEncryptionKeysService', service)
  .component('dbaasLogsDetailEncryptionKeysHome', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
