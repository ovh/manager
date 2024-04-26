import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './ipv6.routes';
import component from './ipv6.component';
import service from './ipv6.service';

import ipAgoraOrderService from '../ip-ip-agoraOrder.service';

const moduleName = 'ovhManagerDedicatedAgoraOrderIpv6';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ovhManagerCatalogPrice',
  ])
  .config(routing)
  .component('agoraIpV6Order', component)
  .service('IpAgoraOrder', ipAgoraOrderService)
  .service('IpAgoraV6Order', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
