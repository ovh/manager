import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import taskTrackerModule from '../../../components/task-tracker';

import deleteModule from './delete';

import autocompleteComponentModule from '../../../components/autocomplete';
import component from './accesses.component';
import routing from './accesses.routing';
import './accesses.styles.scss';

const moduleName = 'ovhManagerNashaDashboardPartitionAccesses';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    taskTrackerModule,
    autocompleteComponentModule,
    deleteModule,
  ])
  .component('nashaDashboardPartitionAccesses', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
