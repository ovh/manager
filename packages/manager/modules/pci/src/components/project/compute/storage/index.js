import angular from 'angular';
import storageIcon from './storage-icon';

const moduleName = 'ovhManagerPciComponentsProjectComputeStorage';

angular
  .module(moduleName, [])
  .component('cloudProjectComputeStorageIcon', storageIcon);

export default moduleName;
