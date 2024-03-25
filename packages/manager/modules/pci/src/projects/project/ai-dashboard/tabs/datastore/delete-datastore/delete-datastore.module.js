import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete-datastore.component';
import routing from './delete-datastore.routing';

const moduleName = 'ovhManagerPciAiDashboardDatastoreDeleteDatastore';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('pciProjectAiDashboardDeleteDatastoreModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
