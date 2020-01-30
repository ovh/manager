class LogsOptionsManageOverviewCtrl {
  constructor(
    $uibModalInstance,
    option,
    aliases,
    dashboards,
    indices,
    inputs,
    roles,
    streams,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.aliases = aliases;
    this.dashboards = dashboards;
    this.indices = indices;
    this.streams = streams;
    this.option = option;
    this.roles = roles;
    this.inputs = inputs;
    this.sortServices();
  }

  sortServices() {
    this.aliases = this.aliases.filter(
      (alias) => alias.info.optionId === this.option.optionId,
    );
    this.dashboards = this.dashboards.filter(
      (dashboard) => dashboard.info.optionId === this.option.optionId,
    );
    this.indices = this.indices.filter(
      (index) => index.info.optionId === this.option.optionId,
    );
    this.streams = this.streams.filter(
      (stream) => stream.info.optionId === this.option.optionId,
    );
    this.roles = this.roles.filter(
      (role) => role.info.optionId === this.option.optionId,
    );
    this.inputs = this.inputs.filter(
      (input) => input.info.optionId === this.option.optionId,
    );
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

angular
  .module('managerApp')
  .controller('LogsOptionsManageOverviewCtrl', LogsOptionsManageOverviewCtrl);
