import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import trafficOrder from './traffic/order';
import trafficCancel from './traffic/cancel';
import trafficService from './traffic/traffic-order.service';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsConsumptionTile';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    trafficOrder,
    trafficCancel,
  ])
  .component('serverConsumptionTile', component)
  .service('ServerOrderTrafficService', trafficService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
