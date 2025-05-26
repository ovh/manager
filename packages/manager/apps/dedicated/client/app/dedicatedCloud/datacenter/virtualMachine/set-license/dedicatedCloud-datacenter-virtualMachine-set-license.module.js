import angular from 'angular';

import datacenterDatastoreVirtualMachineSetLicenseComponent from '../../../../components/dedicated-cloud/datacenter/virtualMachine/set-license';
import routing from './dedicatedCloud-datacenter-virtualMachine-set-license.routes';

const moduleName = 'dedicatedCloudDatacenterVirtualMachineSetLicenseModule';

angular
  .module(moduleName, [datacenterDatastoreVirtualMachineSetLicenseComponent])
  .config(routing);

export default moduleName;
