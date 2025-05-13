import angular from 'angular';

import vmwareOptionOrderComponent from '../../../../components/dedicated-cloud/vmware-option/order';
import routing from './vmware-option-order.routes';

const moduleName = 'managedBaremetalVmwareOptionOrder';

angular.module(moduleName, [vmwareOptionOrderComponent]).config(routing);

export default moduleName;
