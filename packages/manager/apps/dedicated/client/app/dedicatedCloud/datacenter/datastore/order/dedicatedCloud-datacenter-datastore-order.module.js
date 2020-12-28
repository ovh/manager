import angular from 'angular';

import datacenterDatastoreOrderComponent from '../../../../components/dedicated-cloud/datacenter/datastore/order';
import routing from './dedicatedCloud-datacenter-datastore-order.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDatastoreOrder';

angular.module(moduleName, [datacenterDatastoreOrderComponent]).config(routing);

export default moduleName;
