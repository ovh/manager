import angular from 'angular';

import dataProcessingJobStatusComponent from './job-status.component';

const moduleName = 'OvhManagerDataProcessingJobStatusComponent';

angular
  .module(moduleName, [])
  .component('dataprocessingJobStatus', dataProcessingJobStatusComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
