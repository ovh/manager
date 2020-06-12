import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import ovhManagerBillingSummary from '../billing-summary';

import component from './component';
import './index.scss';

const moduleName = 'ovhManagerHubEnterpriseBillingSummary';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerBillingSummary,
    ovhManagerCore,
    'pascalprecht.translate',
  ])
  .component('hubEnterpriseBillingSummary', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
