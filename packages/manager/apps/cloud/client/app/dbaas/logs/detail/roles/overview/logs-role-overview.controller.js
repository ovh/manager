class LogsRoleOverviewCtrl {
  constructor($uibModalInstance, role) {
    this.$uibModalInstance = $uibModalInstance;
    this.permissions = {
      dashboard: [],
      alias: [],
      index: [],
      stream: [],
    };
    this.role = role;
    this.sortPermissions();
  }

  sortPermissions() {
    this.role.permissions.forEach((permission) => {
      if (permission.index) {
        this.permissions.index.push(permission.index);
      }
      if (permission.alias) {
        this.permissions.alias.push(permission.alias);
      }
      if (permission.stream) {
        this.permissions.stream.push(permission.stream);
      }
      if (permission.dashboard) {
        this.permissions.dashboard.push(permission.dashboard);
      }
    });
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular
  .module('managerApp')
  .controller('LogsRoleOverviewCtrl', LogsRoleOverviewCtrl);
