import angular from 'angular';

import datacenterVirtualMachineComponent from '../../../components/dedicated-cloud/datacenter/virtualMachine';
import routing from './dedicatedCloud-datacenter-virtualMachine.routes';
import deleteLicense from './delete-license';
import setLicense from './set-license';

const moduleName = 'ovhManagerDedicatedCloudDatacenterVirtualMachine';

angular
  .module(moduleName, [
    datacenterVirtualMachineComponent,
    deleteLicense,
    setLicense,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
