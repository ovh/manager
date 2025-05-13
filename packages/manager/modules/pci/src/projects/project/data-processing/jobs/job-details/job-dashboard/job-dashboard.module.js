import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@uirouter/angularjs';

import routing from './job-dashboard.routing';

import PciStoragesContainersService from '../../../../storages/containers/containers.service';
import dataProcessingJobDetailsComponent from './job-dashboard.component';
import jobStatus from '../../job-status';
import terminateJob from './terminate-job';
import jobLogs from '../job-logs';

const moduleName = 'ovhManagerPciProjectDataProcessingJobDetailsDashboard';

angular
  .module(moduleName, [
    'ui.router',
    angularTranslate,
    jobStatus,
    terminateJob,
    jobLogs,
  ])
  .config(routing)
  .component(
    'pciProjectDataProcessingJobDetailsDashboard',
    dataProcessingJobDetailsComponent,
  )
  .service('PciStoragesContainersService', PciStoragesContainersService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
