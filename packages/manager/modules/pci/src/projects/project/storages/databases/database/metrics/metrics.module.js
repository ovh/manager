import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './metrics.component';
import routing from './metrics.routing';
import timeRange from '../../components/time-range';

const moduleName = 'ovhManagerPciStoragesDatabasesMetrics';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    'ovhManagerPciComponents',
    timeRange,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseMetricsComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
