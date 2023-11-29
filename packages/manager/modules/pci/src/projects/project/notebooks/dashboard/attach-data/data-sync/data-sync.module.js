import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './data-sync.component';
import routing from './data-sync.routing';

const moduleName = 'ovhManagerPciNotebooksAttachDataDataSync';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('ovhManagerPciProjectNotebookAttachDataDataSyncModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
