import angular from 'angular';

import datacenterDatastoreVirtualMachineDeleteLicenseComponent from '../../../../components/dedicated-cloud/datacenter/virtualMachine/delete-license';
import routing from './dedicatedCloud-datacenter-virtualMachine-delete-license.routes';

const moduleName = 'dedicatedCloudDatacenterVirtualMachineDeleteLicenseModule';

angular
  .module(moduleName, [datacenterDatastoreVirtualMachineDeleteLicenseComponent])
  .config(routing);

export default moduleName;
