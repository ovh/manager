import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import angularTranslate from 'angular-translate';

import component from './ip-display.component';

const moduleName = 'ovhManagerOtbDetailsIpDisplay';

angular
  .module(moduleName, [ngTranslateAsyncLoader, angularTranslate])
  .component('ipDisplay', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
