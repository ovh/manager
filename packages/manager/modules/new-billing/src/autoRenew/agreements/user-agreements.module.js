import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import acceptAll from './popup-agreement/popup-agreement.module';
import details from './details/details.module';
import routing from './user-agreements.routes';
import service from './user-agreements.service';

const moduleName = 'ovhManagerBillingAgreements';

angular
  .module(moduleName, [
    acceptAll,
    angularTranslate,
    details,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .service('UserAccountServicesAgreements', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
