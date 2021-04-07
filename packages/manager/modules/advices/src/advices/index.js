import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import './index.less';

import advices from './component';

const moduleName = 'ovhManagerAdvicesAdvice';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'ui.router'])
  .component('ovhAdvices', advices)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
