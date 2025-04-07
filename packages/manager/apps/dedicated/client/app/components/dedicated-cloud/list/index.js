import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import PccGuides from '../guides';
import component from './dedicatedCloud-list.component';

const moduleName = 'ovhManagerPccList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    PccGuides,
  ])
  .component('ovhManagerPccList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
