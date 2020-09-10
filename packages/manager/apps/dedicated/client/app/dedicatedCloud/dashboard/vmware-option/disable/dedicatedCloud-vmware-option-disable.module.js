import angular from 'angular';

import vmwareOptionDisableComponent from '../../../../components/dedicated-cloud/vmware-option/disable';
import routing from './dedicatedCloud-vmware-option-disable.routes';

const moduleName = 'dedicatedCloudVmwareOptionDisable';

angular.module(moduleName, [vmwareOptionDisableComponent]).config(routing);

export default moduleName;
