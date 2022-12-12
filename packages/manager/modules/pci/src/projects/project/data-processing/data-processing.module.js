import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-swimming-poll';

import routing from './data-processing.routing';
import dataProcessingService from './data-processing.service';
import dataProcessingJobs from './jobs';
import dataProcessingNotebooks from './notebooks';
import dataProcessingHome from './home';
import dataProcessingComponent from './data-processing.component';
import onboarding from './onboarding';

const moduleName = 'ovhManagerPciProjectDataProcessing';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngOvhSwimmingPoll',
    dataProcessingJobs,
    dataProcessingNotebooks,
    dataProcessingHome,
    onboarding,
  ])
  .config(routing)
  .component('pciProjectDataProcessing', dataProcessingComponent)
  .service('dataProcessingService', dataProcessingService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
