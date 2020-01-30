angular.module('managerApp').component('archiveStorageList', {
  templateUrl:
    'app/cloud/components/project/billing/archive-storage-list/billing-archive-storage-list.component.html',
  controller: 'BillingArchiveStorageListComponentCtrl',
  bindings: {
    storages: '<',
  },
});
