import controller from './veeam-storage-update-quota.controller';
import template from './veeam-storage-update-quota.html';

export default {
  controller,
  controllerAs: 'VeeamCloudConnectStorageUpdateQuotaCtrl',
  template,
  bindings: {
    serviceName: '<',
    inventoryName: '<',
    goToStorage: '<',
  },
};
