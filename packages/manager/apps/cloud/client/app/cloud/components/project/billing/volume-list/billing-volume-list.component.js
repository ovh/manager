angular.module('managerApp').component('volumeList', {
  templateUrl:
    'app/cloud/components/project/billing/volume-list/billing-volume-list.component.html',
  controller: 'BillingVolumeListComponentCtrl',
  bindings: {
    volumes: '<',
  },
});
