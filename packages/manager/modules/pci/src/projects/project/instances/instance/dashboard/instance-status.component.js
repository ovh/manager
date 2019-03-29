export default {
  template: `
    <span class="oui-status oui-status_info"
          ng-class="'oui-status_' + $ctrl.getStatusLevel()"
          ng-bind="$ctrl.status">
    </span>`,
  controller: function controller() {
    this.getStatusLevel = function getStatusLevel() {
      switch (this.status) {
        case 'ACTIVE': return 'success';
        case 'BUILDING': return 'info';
        case 'DELETED': return 'error';
        case 'ERROR': return 'error';
        case 'HARD_REBOOT': return 'warning';
        case 'PASSWORD': return 'info';
        case 'PAUSED': return 'info';
        case 'REBOOT': return 'info';
        case 'REBUILD': return 'info';
        case 'RESCUED': return 'success';
        case 'RESIZED': return 'success';
        case 'REVERT_RESIZE': return 'warning';
        case 'SOFT_DELETED': return 'warning';
        case 'STOPPED': return 'error';
        case 'SUSPENDED': return 'error';
        case 'UNKNOWN': return 'error';
        case 'VERIFY_RESIZE': return 'info';
        case 'MIGRATING': return 'info';
        case 'RESIZE': return 'info';
        case 'BUILD': return 'info';
        case 'SHUTOFF': return 'warning';
        case 'RESCUE': return 'info';
        case 'SHELVED': return 'info';
        case 'SHELVED_OFFLOADED': return 'info';
        case 'RESCUING': return 'info';
        case 'UNRESCUING': return 'info';
        case 'SNAPSHOTTING': return 'info';
        case 'RESUMING': return 'info';
        default: return 'info';
      }
    };
  },
  bindings: {
    status: '<',
  },
};
