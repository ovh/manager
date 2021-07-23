import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciNotebooksNotebookDashboardTags';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciNotebooksNotebookDashboardTagsAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
