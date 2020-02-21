import angular from 'angular';
import '@uirouter/angularjs';
import 'angularjs-scroll-glue';

import routing from './job-logs.routing';

import dataProcessingJobDetailsComponent from './job-logs.component';
import jobLogsService from './job-logs.service';

const moduleName = 'ovhManagerDataProcessingJobLogsComponent';

angular
  .module(moduleName, ['ui.router', 'luegg.directives'])
  .config(routing)
  .component(
    'dataprocessingJobLogsComponent',
    dataProcessingJobDetailsComponent,
  )
  .service('dataProcessingJobLogsService', jobLogsService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
