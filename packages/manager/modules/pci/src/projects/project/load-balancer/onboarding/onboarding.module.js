import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './onboarding.component';
import empty from '../../../../components/project/empty';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerPciLoadBalancerOnboarding';

angular
  .module(moduleName, [
    empty,
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectLoadBalancerOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
