import angular from 'angular';

import component from './terminate-job.component';
import routing from './terminate-job.routing';

const moduleName = 'ovhManagerDataProcessingQuickTerminateModalComponent';

angular
  .module(moduleName, [])
  .config(routing)
  .component('dataprocessingQuickTerminateJobModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
