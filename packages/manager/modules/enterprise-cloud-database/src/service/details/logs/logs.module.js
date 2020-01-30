import angular from 'angular';

import enterpriseCloudDatabaseServiceDetailsLogsComponent from './logs.component';
import routing from './logs.routing';
import grantAdpAccess from './grant-access';
import revokeAdpAccess from './revoke-access';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsLogs';

angular
  .module(moduleName, [grantAdpAccess, revokeAdpAccess])
  .config(routing)
  .component(
    'enterpriseCloudDatabaseServiceDetailsLogsComponent',
    enterpriseCloudDatabaseServiceDetailsLogsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
