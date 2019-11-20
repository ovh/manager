import angular from 'angular';
import '@ovh-ux/ng-ovh-swimming-poll';
import moment from 'moment';

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

const moduleName = 'ovhManagerDataProcessingComponent';

angular
  .module(moduleName, [
    'ngOvhSwimmingPoll',
    submitJob,
    jobDetails,
    jobStatus,
    onboarding,
    labs,
    terminateJob,
  ])
  .config(routing)
  .component('dataProcessingComponent', dataProcessingComponent)
  .service('dataProcessingService', dataProcessingService)
  // setup a templating filter to parse dates using Moment.js
  .filter('momentFormat', () => (value, format) => moment(value)
    .format(format))
  .filter('momentCalendar', () => value => moment(value)
    .calendar())
  .filter('momentRelative', () => value => moment(value)
    .fromNow())
  .filter('momentISO', () => value => moment(value)
    .toISOString())
  // setup a templating filter to return nicely formatted durations
  .filter('duration', () => value => formatDuration(value))
  .filter('memory', () => (value, unit) => convertMemory(value, unit))
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
