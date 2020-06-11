import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@uirouter/angularjs';

import routing from './job-details.routing';

import dataProcessingJobDetailsComponent from './job-details.component';
import jobDashboard from './job-dashboard';
import jobLogs from './job-logs';

const moduleName = 'ovhManagerPciProjectDataProcessingJobDetails';

angular
  .module(moduleName, ['ui.router', angularTranslate, jobDashboard, jobLogs])
  .config(routing)
  .component(
    'pciProjectDataProcessingJobDetails',
    dataProcessingJobDetailsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
