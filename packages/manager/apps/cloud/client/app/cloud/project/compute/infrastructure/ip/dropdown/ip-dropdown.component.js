angular.module('managerApp').component('ipDropdown', {
  templateUrl:
    'app/cloud/project/compute/infrastructure/ip/dropdown/ip-dropdown.component.html',
  controller: 'IpDropdownComponentCtrl',
  bindings: {
    ip: '<',
    user: '<',
    infra: '<',
    onFailoverAttach: '&',
    isDisabled: '<',
    ipAccessKey: '<',
  },
});
