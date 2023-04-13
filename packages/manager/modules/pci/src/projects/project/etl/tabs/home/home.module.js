import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './home.component';
import routing from './home.routing';

import workflowsListComponent from '../../components/workflowsList';
import workflowJobsListComponent from '../../components/jobsList';

const moduleName = 'ovhManagerPciEtlHome';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    workflowsListComponent,
    workflowJobsListComponent,
  ])
  .config(routing)
  .component('pciProjectEtlHome', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
