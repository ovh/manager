import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import routing from './delete.routing';
import component from './delete.component';

const moduleName = 'ovhManagerPciAiDashboardRegistriesDelete';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectAiDashboardRegistriesDeleteModal', component);

export default moduleName;
