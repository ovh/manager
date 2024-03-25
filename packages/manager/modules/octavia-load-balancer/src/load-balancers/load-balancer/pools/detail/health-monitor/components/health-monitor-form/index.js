import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

import './styles.scss';

const moduleName = 'ovhManagerHealthMonitorForm';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('octaviaLoadBalancerHealthMonitorForm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
