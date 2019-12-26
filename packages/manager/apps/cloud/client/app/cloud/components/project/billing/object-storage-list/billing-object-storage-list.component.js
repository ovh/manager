angular.module('managerApp').component('objectStorageList', {
  templateUrl:
    'app/cloud/components/project/billing/object-storage-list/billing-object-storage-list.component.html',
  controller: 'BillingObjectStorageListComponentCtrl',
  bindings: {
    storages: '<',
  },
});
