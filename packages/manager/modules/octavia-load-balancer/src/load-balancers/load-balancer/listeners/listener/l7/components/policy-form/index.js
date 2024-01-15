import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerL7PolicyForm';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('octaviaLoadBalancerL7PolicyForm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
