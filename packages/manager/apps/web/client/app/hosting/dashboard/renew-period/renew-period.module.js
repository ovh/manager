import angular from 'angular';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './renew-period.component';
import routing from './renew-period.routing';
import service from './renew-period.service';

const moduleName = 'ovhManagerHostingRenewPeriod';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    uiRouter,
  ])
  .component('hostingRenewPeriodComponent', component)
  .service('HostingRenewPeriodService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
