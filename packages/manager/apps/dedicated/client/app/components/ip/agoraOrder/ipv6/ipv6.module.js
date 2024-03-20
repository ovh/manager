import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './ipv6.routes';
import controller from './ipv6.controller';

import service from '../ip-ip-agoraOrder.service';

const moduleName = 'ovhManagerDedicatedAgoraOrderIpv6';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    'oc.lazyLoad',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ovhManagerCatalogPrice'
  ])
  .config(routing)
  .controller('AgoraIpV6OrderController', controller)
  .service('IpAgoraOrder', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
