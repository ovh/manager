import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './repayments.routing';
import component from './list/repayments-list.component';

const moduleName = 'ovhManagerTelecomTelephonyRepayments';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .component('telecomTelephonyRepaymentsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
