import angular from 'angular';

import datacenterDatastoreOrderComponent from '../../../../components/dedicated-cloud/datacenter/datastore/order';
import routing from './order.routes';

const moduleName = 'managedBaremetalDatacenterDatastoreOrder';

angular
  .module(moduleName, [datacenterDatastoreOrderComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
