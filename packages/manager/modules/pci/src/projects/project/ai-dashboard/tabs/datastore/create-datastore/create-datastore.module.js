import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './create-datastore.component';
import routing from './create-datastore.routing';

const moduleName = 'ovhManagerPciAiDashboardDatastoreCreateDatastore';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('pciProjectAiDashboardCreateDatastoreModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
