import controller from './veeam-storage.controller';
import template from './veeam-storage.html';

export default {
  controller,
  controllerAs: 'VeeamCloudConnectStorageCtrl',
  template,
  bindings: {
    serviceName: '<',
    goToStorageAdd: '<',
    goToStorageQuota: '<',
  },
};
