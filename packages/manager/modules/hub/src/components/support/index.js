import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import component from './component';

import './index.scss';

const moduleName = 'ovhManagerHubSupport';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerHubSupport', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
