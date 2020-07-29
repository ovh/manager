import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './increase-request.component';
import routing from './increase-request.routing';

const moduleName = 'ovhManagerPciProjectQuotaIncrease';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectQuotaIncrease', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
