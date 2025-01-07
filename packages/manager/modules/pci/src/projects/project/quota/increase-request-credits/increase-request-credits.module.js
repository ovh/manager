import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './increase-request-credits.component';
import routing from './increase-request-credits.routing';
import service from './increase-request-credits.service';

const moduleName = 'ovhManagerPciProjectQuotaIncreaseCredits';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectQuotaIncreaseCredits', component)
  .service('pciProjectQuotaIncreaseCredits', service)
  .run(/* @ngTranslationsInject:json ../increase-request/translations */);

export default moduleName;
