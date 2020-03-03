import angular from 'angular';

import dataProcessingJobStatusComponent from './job-status.component';

const moduleName = 'OvhManagerPciProjectDataProcessingJobStatusComponent';

angular
  .module(moduleName, [])
  .component(
    'pciProjectDataProcessingJobStatus',
    dataProcessingJobStatusComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
