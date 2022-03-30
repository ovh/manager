import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './stop-notebook.component';
import routing from './stop-notebook.routing';

const moduleName = 'ovhManagerPciNotebooksNotebookDashboardNotebookStop';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciNotebooksNotebookDashboardNotebookStop', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
