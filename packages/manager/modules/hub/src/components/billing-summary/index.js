import angular from 'angular';
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
    'pascalprecht.translate',
  ])
  .component('ovhManagerHubUserBillingSummary', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
