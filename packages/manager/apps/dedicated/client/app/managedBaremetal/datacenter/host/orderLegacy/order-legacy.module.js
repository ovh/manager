import angular from 'angular';

import datacenterHostOrderComponent from '../../../../components/dedicated-cloud/datacenter/host/orderLegacy';
import routing from './order-legacy.routes';

const moduleName = 'managedBaremetalDatacenterHostOrder';

angular.module(moduleName, [datacenterHostOrderComponent]).config(routing);

export default moduleName;
