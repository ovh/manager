import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';
import 'angular-translate';
import component from './component';

import './index.scss';

const moduleName = 'ovhManagerHubBillingSummary';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
    'ngAtInternet',
    'pascalprecht.translate',
  ])
  .component('hubBillingSummary', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
