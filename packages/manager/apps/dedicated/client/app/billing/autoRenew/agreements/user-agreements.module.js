import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import acceptAll from './popup-agreement/popup-agreement.module';
import details from './details/details.module';
import routing from './user-agreements.routes';
import service from './user-agreements.service';

const moduleName = 'ovhManagerBillingAgreements';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    acceptAll,
    details,
  ])
  .config(routing)
  .service('UserAccountServicesAgreements', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
