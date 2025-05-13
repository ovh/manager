import map from 'lodash/map';

export default class LogsRolesAddMembersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $uibModalInstance,
    CucControllerHelper,
    logs,
    LogsRolesService,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.roleId = this.$stateParams.roleId;
    this.$uibModalInstance = $uibModalInstance;
    this.logs = logs;
    this.LogsRolesService = LogsRolesService;
    this.isEdit = false;
    this.member = {};
  }

  $onInit() {
    if (this.isEdit) {
      this.title = 'logs_member_modal_edit_title';
    } else {
      this.title = 'logs_member_modal_add_title';
    }
    this.isLoading = true;
    this.logs.promise
      .then(() => {
        this.users = map(this.logs.data, 'username');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  addMember() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsRolesService.createMember(this.serviceName, this.roleId, {
          username: this.member.username,
          note: this.member.note,
        })
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }
}
