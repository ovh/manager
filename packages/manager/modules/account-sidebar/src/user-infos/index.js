import angular from 'angular';
import component from './component';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import './index.scss';

const moduleName = 'ovhManagerHubUserInfos';
angular
  .module(moduleName, [
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerHubUserInfos', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
