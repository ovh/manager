import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@uirouter/angularjs';
import 'angularjs-scroll-glue';

import routing from './job-logs.routing';

import dataProcessingJobDetailsComponent from './job-logs.component';
import jobLogsService from './job-logs.service';

const moduleName = 'ovhManagerPciProjectDataProcessingJobLogs';

angular
  .module(moduleName, ['ui.router', 'luegg.directives', angularTranslate])
  .config(routing)
  .component(
    'pciProjectDataProcessingJobLogs',
    dataProcessingJobDetailsComponent,
  )
  .service('dataProcessingJobLogsService', jobLogsService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
