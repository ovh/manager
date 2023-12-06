import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerHub from '@ovh-ux/manager-hub';

import component from './catalog.component';
import routing from './routing';

import './catalog.scss';

const moduleName = 'ovhManagerHubCatalogPage';

angular
  .module(moduleName, [
    ngOvhTranslateAsyncLoader,
    'oui',
    ovhManagerHub,
    'pascalprecht.translate',
    uiRouter,
  ])
  .component('hubCatalog', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
