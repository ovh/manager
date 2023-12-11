import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import '@ovh-ux/ui-kit';

import orderCart from '../../order-cart.service'; // TODO remove it
import service from '../../new/service';
import component from './activate.component';
import routing from './activate.routing';
import projectService from '../project.service';
import './index.scss';

const moduleName = 'ovhManagerPciProjectActivate';

angular
  .module(moduleName, ['oui', 'ovhManagerCore', 'pascalprecht.translate'])
  .config(routing)
  .component('pciProjectActivate', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('orderCart', orderCart)
  .service('pciProjectNew', service)
  .service('projectService', projectService);
export default moduleName;
