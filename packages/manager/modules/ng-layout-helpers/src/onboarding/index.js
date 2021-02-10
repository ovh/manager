import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './onboarding.component';

import './index.less';

const moduleName = 'ovhManagerOnBoardingLayout';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('managerOnBoardingLayout', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
