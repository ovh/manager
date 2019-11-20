import angular from 'angular';

import component from './terminate-job.component';
import routing from './terminate-job.routing';

const moduleName = 'ovhManagerDataProcessingTerminateJobModalComponent';

angular.module(moduleName, [])
  .config(routing)
  .component('dataprocessingTerminateJobModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
