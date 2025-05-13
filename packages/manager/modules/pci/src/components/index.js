import angular from 'angular';

import cucConsumption from './consumption';
import cucCurrency from './currency';
import project from './project';
import projectQuotaExceedErrorModal from './project-quota-exceed-error-modal';
import pciAiDataSyncModal from './pci-ai-data-sync';
import runabove from './runabove';
import writeRightRequired from './writeRightRequired';
import ovhManagerPciOrderCommand from './pci-order-command';

const moduleName = 'ovhManagerPciComponents';

angular.module(moduleName, [
  cucConsumption,
  cucCurrency,
  project,
  projectQuotaExceedErrorModal,
  runabove,
  writeRightRequired,
  ovhManagerPciOrderCommand,
  pciAiDataSyncModal,
]);

export default moduleName;
