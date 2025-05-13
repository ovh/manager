import angular from 'angular';

import datacenterHostOrderComponent from '../../../../components/dedicated-cloud/datacenter/host/orderLegacy';
import routing from './dedicatedCloud-datacenter-host-order-legacy.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterHostOrder';

angular.module(moduleName, [datacenterHostOrderComponent]).config(routing);

export default moduleName;
