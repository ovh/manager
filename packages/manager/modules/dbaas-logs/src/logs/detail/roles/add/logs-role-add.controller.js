export default class LogsRoleAddModalCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $uibModalInstance,
    CucControllerHelper,
    LogsRolesService,
    roleInfo,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.CucControllerHelper = CucControllerHelper;
    this.roleInfo = roleInfo;
    this.LogsRolesService = LogsRolesService;
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = $stateParams.serviceName;
    this.role = this.LogsRolesService.getNewRole();
  }

  $onInit() {
    this.isEdit = this.constructor.checkIsEdit(this.roleInfo);
    if (this.isEdit) {
      this.populateRole();
    } else {
      this.clearRole();
    }
  }

  clearRole() {
    this.title = 'logs_role_modal_add_title';
    this.role.description = '';
    this.role.name = '';
  }

  populateRole() {
    this.title = 'logs_role_modal_edit_title';
    this.role.description = this.roleInfo.description;
    this.role.name = this.roleInfo.name;
  }

  static checkIsEdit(roleInfo) {
    return roleInfo !== undefined;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  save() {
    if (this.isEdit) {
      this.updateRole();
    } else {
      this.saveRole();
    }
  }

  saveRole() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsRolesService.addRole(this.serviceName, this.role)
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  updateRole() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsRolesService.updateRole(
          this.serviceName,
          this.roleInfo.roleId,
          this.role,
        )
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }
}
