import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './onboarding.routing';
import orderCart from '../order-cart.service'; // TODO remove it
import service from '../new/service';
import component from './onboarding.component';
import './onboarding.less';

const moduleName = 'ovhManagerPciProjectsOnboarding';

angular
  .module(moduleName, ['oui', 'ovhManagerCore', 'pascalprecht.translate'])
  .config(routing)
  .component('pciProjectsOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('orderCart', orderCart)
  .service('pciProjectNew', service);
export default moduleName;
