import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './load-balancer.component';
import onboarding from './onboarding';
import routing from './load-balancer.routing';
import service from './load-balancer.service';

const moduleName = 'ovhManagerPciProjectLoadBalancer';

angular
  .module(moduleName, [
    onboarding,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectLoadBalancer', component)
  .service('PciLoadBalancerService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
