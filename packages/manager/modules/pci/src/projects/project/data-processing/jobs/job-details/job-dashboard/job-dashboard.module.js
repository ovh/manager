import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@uirouter/angularjs';

import routing from './job-dashboard.routing';

import PciStoragesContainersService from '../../../../storages/containers/containers.service';
import dataProcessingJobDetailsComponent from './job-dashboard.component';
import jobStatus from '../../job-status';
import terminateJob from './terminate-job';
import metricsToken from './metrics-token';
import jobLogs from '../job-logs';
import metricsChart from './metrics-chart';

const moduleName = 'ovhManagerPciProjectDataProcessingJobDetailsDashboard';

angular
  .module(moduleName, [
    'ui.router',
    angularTranslate,
    jobStatus,
    terminateJob,
    jobLogs,
    metricsChart,
    metricsToken,
  ])
  .config(routing)
  .component(
    'pciProjectDataProcessingJobDetailsDashboard',
    dataProcessingJobDetailsComponent,
  )
  .service('PciStoragesContainersService', PciStoragesContainersService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
