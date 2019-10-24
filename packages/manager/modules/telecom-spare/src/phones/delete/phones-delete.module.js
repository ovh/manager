import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './phones-delete.component';
import routing from './phones-delete.routing';

const moduleName = 'ovhManagerTelecomSparePhonesDelete';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('deletePhonesSpare', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
