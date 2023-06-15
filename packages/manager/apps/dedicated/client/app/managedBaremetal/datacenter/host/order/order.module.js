import angular from 'angular';

import datacenterHostOrderComponent from '../../../../components/dedicated-cloud/datacenter/host/order';
import routing from './order.routes';

const moduleName = 'managedBaremetalDatacenterHostOrder';

angular
  .module(moduleName, [datacenterHostOrderComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
