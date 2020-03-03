import angular from 'angular';
import '@uirouter/angularjs';

import routing from './job-details.routing';

import dataProcessingJobDetailsComponent from './job-details.component';
import jobDashboard from './job-dashboard';
import jobLogs from './job-logs';

const moduleName =
  'ovhManagerPciProjectDataProcessingSubmitJobComponentLazyLoading';

angular
  .module(moduleName, ['ui.router', jobDashboard, jobLogs])
  .config(routing)
  .component(
    'pciProjectDataProcessingJobDetailsComponent',
    dataProcessingJobDetailsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
