import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import advices from './advices';

const moduleName = 'ovhManagerAdvices';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngAtInternet',
    advices,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
