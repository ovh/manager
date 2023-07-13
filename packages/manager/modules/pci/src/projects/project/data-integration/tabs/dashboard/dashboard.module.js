import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './dashboard.component';
import routing from './dashboard.routing';

import workflowsListComponent from './components/workflowsList';
import workflowJobsListComponent from './components/jobsList';

const moduleName = 'ovhManagerPciDataIntegrationDashboard';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    'ovhManagerPciComponents',
    workflowsListComponent,
    workflowJobsListComponent,
  ])
  .config(routing)
  .component('pciProjectDataIntegrationDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
