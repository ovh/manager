import angular from 'angular';
import '@uirouter/angularjs';

import routing from './job-dashboard.routing';

import PciStoragesContainersService from '../../../storages/containers/containers.service';
import dataProcessingJobDetailsComponent from './job-dashboard.component';
import jobStatus from '../../job-status';
import terminateJob from './terminate-job';
import metricsToken from './metrics-token';
import jobLogs from '../job-logs';
import metricsChart from './metrics-chart';

const moduleName = 'ovhManagerDataProcessingJobDetailsDashboardComponent';

angular
  .module(moduleName, [
    'ui.router',
    jobStatus,
    terminateJob,
    jobLogs,
    metricsChart,
    metricsToken,
  ])
  .config(routing)
  .component(
    'dataProcessingJobDetailsDashboardComponent',
    dataProcessingJobDetailsComponent,
  )
  .service('PciStoragesContainersService', PciStoragesContainersService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
