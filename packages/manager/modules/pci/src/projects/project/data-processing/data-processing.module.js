import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-swimming-poll';

import routing from './data-processing.routing';
import dataProcessingComponent from './data-processing.component';
import dataProcessingService from './data-processing.service';
import submitJob from './submit-job';
import jobDetails from './job-details';
import jobStatus from './job-status';
import onboarding from './onboarding';
import labs from '../../../components/project/labs';
import terminateJob from './terminate-job';
import { convertMemory, formatDuration } from './data-processing.utils';

const moduleName = 'ovhManagerPciProjectDataProcessing';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngOvhSwimmingPoll',
    submitJob,
    jobDetails,
    jobStatus,
    onboarding,
    labs,
    terminateJob,
  ])
  .config(routing)
  .component('pciProjectDataProcessing', dataProcessingComponent)
  .service('dataProcessingService', dataProcessingService)
  // setup a templating filter to return nicely formatted durations
  .filter('dataProcessingDuration', () => (value) => formatDuration(value))
  .filter('dataProcessingMemory', () => (value, unit) =>
    convertMemory(value, unit),
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
