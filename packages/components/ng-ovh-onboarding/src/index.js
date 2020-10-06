import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './onboarding.component';

import './index.less';

const moduleName = 'ngOvhOnboarding';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('ovhOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
