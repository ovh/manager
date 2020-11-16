import angular from 'angular';

import vmwareOptionOrderComponent from '../../../../components/dedicated-cloud/vmware-option/order';
import routing from './dedicatedCloud-vmware-option-order.routes';

const moduleName = 'dedicatedCloudVmwareOptionOrder';

angular.module(moduleName, [vmwareOptionOrderComponent]).config(routing);

export default moduleName;
