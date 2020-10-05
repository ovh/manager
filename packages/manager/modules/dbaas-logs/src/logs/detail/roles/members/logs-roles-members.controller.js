import template from './add/add-members.html';

export default class LogsRolesMembersCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    CucControllerHelper,
    CucCloudMessage,
    LogsRolesService,
  ) {
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.roleId = this.$stateParams.roleId;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsRolesService = LogsRolesService;
    this.CucCloudMessage = CucCloudMessage;

    this.initLoaders();
  }

  initLoaders() {
    this.roleDetails = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.getRoleDetails(this.serviceName, this.roleId),
    });

    this.logs = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.getLogs(),
    });

    this.roleDetails.load();
    this.logs.load();
  }

  add() {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          template,
          controller: 'LogsRolesAddMembersCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
          resolve: {
            serviceName: () => this.serviceName,
            logs: () => this.logs,
          },
        },
      })
      .then(() => this.initLoaders());
  }

  revoke(info) {
    this.CucCloudMessage.flushChildMessage();
    this.LogsRolesService.deleteMemberModal(info.username).then(() => {
      this.delete = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsRolesService.removeMember(
            this.serviceName,
            this.roleId,
            info.username,
          ).then(() => this.initLoaders()),
      });
      this.delete.load();
    });
  }
}
