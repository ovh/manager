import angular from 'angular';

import datacenterVirtualMachineComponent from '../../../components/dedicated-cloud/datacenter/virtualMachine';
import routing from './dedicatedCloud-datacenter-virtualMachine.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterVirtualMachine';

angular
  .module(moduleName, [datacenterVirtualMachineComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
