import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-list.component';

const moduleName = 'ovhManagerPccList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerPccList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
