import angular from 'angular';

import datacenterHostOrderComponent from '../../../../components/dedicated-cloud/datacenter/host/order';
import routing from './dedicatedCloud-datacenter-host-order.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterHostOrder';

angular.module(moduleName, [datacenterHostOrderComponent]).config(routing);

export default moduleName;
