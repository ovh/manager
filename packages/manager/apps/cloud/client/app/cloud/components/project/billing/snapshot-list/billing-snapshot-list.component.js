angular.module('managerApp').component('snapshotList', {
  templateUrl:
    'app/cloud/components/project/billing/snapshot-list/billing-snapshot-list.component.html',
  controller: 'BillingSnapshotListComponentCtrl',
  bindings: {
    snapshots: '<',
  },
});
