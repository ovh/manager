import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import service from './ipv4.service';
import routing from './ipv4.routes';
import component from './ipv4.component';

const moduleName = 'ovhManagerDedicatedAgoraOrderIpv4';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    'oc.lazyLoad',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ovhManagerCatalogPrice',
  ])
  .config(routing)
  .component('agoraIpV4Order', component)
  .service('Ipv4AgoraOrder', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
