import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-swimming-poll';

import routing from './data-processing-notebooks.routing';
import dataProcessingComponentNotebooks from './data-processing-notebooks.component';
import dataProcessingService from '../data-processing.service';
import notebookStatus from './notebook-status';
import notebookDetails from './notebook-details';
import labs from '../../../../components/project/labs';
import terminateNotebook from './terminate-notebook';
import addNotebook from './add-notebook';
import deleteNotebook from './delete-notebook';
import { convertMemory, formatDuration } from '../data-processing.utils';

const moduleName = 'ovhManagerPciProjectDataProcessingNotebooks';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngOvhSwimmingPoll',
    notebookStatus,
    labs,
    terminateNotebook,
    deleteNotebook,
    addNotebook,
    notebookDetails,
  ])
  .config(routing)
  .component(
    'pciProjectDataProcessingNotebooks',
    dataProcessingComponentNotebooks,
  )
  .service('dataProcessingService', dataProcessingService)
  // setup a templating filter to return nicely formatted durations
  .filter('dataProcessingDuration', () => (value) => formatDuration(value))
  .filter('dataProcessingMemory', () => (value, unit) =>
    convertMemory(value, unit),
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
