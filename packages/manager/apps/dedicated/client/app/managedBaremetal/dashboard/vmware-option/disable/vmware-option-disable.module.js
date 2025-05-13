import angular from 'angular';

import vmwareOptionDisableComponent from '../../../../components/dedicated-cloud/vmware-option/disable';
import routing from './vmware-option-disable.routes';

const moduleName = 'managedBaremetalVmwareOptionDisable';

angular.module(moduleName, [vmwareOptionDisableComponent]).config(routing);

export default moduleName;
