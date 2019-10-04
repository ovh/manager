import angular from 'angular';

import backups from './backups';
import clusterSize from './cluster-nodes';
import enterpriseCloudDatabaseServiceDetailsComponent from './details.component';
import insights from './insights';
import logs from './logs';
import overview from './overview';
import restoredInstances from './restored-instances';
import routing from './details.routing';
import settings from './settings';

const moduleName = 'enterpriseCloudDatabaseServiceDetails';

angular
  .module(moduleName, [
    backups,
    clusterSize,
    insights,
    logs,
    overview,
    restoredInstances,
    settings,
  ])
  .config(routing)
  .component('enterpriseCloudDatabaseServiceDetailsComponent', enterpriseCloudDatabaseServiceDetailsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
