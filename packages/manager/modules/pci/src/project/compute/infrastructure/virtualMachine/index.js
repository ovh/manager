import angular from 'angular';

import add from './add';
import addEdit from './addEdit';

import deleteController from './delete/controller';
import deleteTemplate from './delete/template.html';

import loginInformationController from './loginInformation/controller';
import loginInformationTemplate from './loginInformation/template.html';

import monitoringController from './monitoring/controller';
import monitoringTemplate from './monitoring/template.html';

import monthlyConfirmController from './monthlyConfirm/controller';
import monthlyConfirmTemplate from './monthlyConfirm/template.html';

import rescueController from './rescue/controller';
import rescueTemplate from './rescue/template.html';

import vncConfirmController from './vnc/controller';
import vncConfirmTemplate from './vnc/template.html';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureVirtualMachine';

angular
  .module(moduleName, [
    add,
    addEdit,
  ])
  .controller('CloudprojectcomputeinfrastructurevirtualmachinedeleteCtrl', deleteController)
  .controller('CloudProjectComputeInfrastructureVirtualMachineLoginInformationCtrl', loginInformationController)
  .controller('CloudProjectComputeInfrastructureVirtualMachineMonitoringCtrl', monitoringController)
  .controller('CloudProjectComputeInfrastructureVirtualmachineMonthlyConfirm', monthlyConfirmController)
  .controller('CloudProjectComputeInfrastructureVirtualmachineRescueCtrl', rescueController)
  .controller('CloudProjectComputeInfrastructureVirtualmachineVncCtrl', vncConfirmController)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/infrastructure/virtualMachine/delete/template.html', deleteTemplate);
    $templateCache.put('pci/project/compute/infrastructure/virtualMachine/loginInformation/template.html', loginInformationTemplate);
    $templateCache.put('pci/project/compute/infrastructure/virtualMachine/monitoring/template.html', monitoringTemplate);
    $templateCache.put('pci/project/compute/infrastructure/virtualMachine/monthlyConfirm/template.html', monthlyConfirmTemplate);
    $templateCache.put('pci/project/compute/infrastructure/virtualMachine/rescue/template.html', rescueTemplate);
    $templateCache.put('pci/project/compute/infrastructure/virtualMachine/vnc/template.html', vncConfirmTemplate);
  });

export default moduleName;
