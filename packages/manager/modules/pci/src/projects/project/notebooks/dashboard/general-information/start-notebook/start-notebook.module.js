import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './start-notebook.component';
import routing from './start-notebook.routing';

const moduleName = 'ovhManagerPciNotebooksNotebookDashboardStartNotebook';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciNotebooksNotebookDashboardStartNotebook', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
