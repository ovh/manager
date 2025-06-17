import angular from 'angular';

import datacenterVirtualMachineComponent from '../../../components/dedicated-cloud/datacenter/virtualMachine';
import routing from './datacenter-virtualMachine.routes';
import deleteLicense from './delete-license';
import setLicense from './set-license';

const moduleName = 'managedBaremetalDatacenterVirtualMachine';

angular
  .module(moduleName, [
    datacenterVirtualMachineComponent,
    deleteLicense,
    setLicense,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
