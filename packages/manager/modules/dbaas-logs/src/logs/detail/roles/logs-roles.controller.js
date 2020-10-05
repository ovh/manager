import addTemplate from './add/logs-role-add.html';
import overviewTemplate from './overview/logs-role-overview.html';

export default class LogsRolesCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    CucCloudMessage,
    CucControllerHelper,
    LogsRolesService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsRolesService = LogsRolesService;
    this.CucCloudMessage = CucCloudMessage;
    this.initLoaders();
  }

  initLoaders() {
    this.roles = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.getRoles(this.serviceName),
    });

    this.roles.load();
  }

  add(info) {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          template: addTemplate,
          controller: 'LogsRoleAddModalCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
          resolve: {
            roleInfo: () => info,
          },
        },
      })
      .then(() => this.initLoaders());
  }

  summary(info) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: overviewTemplate,
        controller: 'LogsRoleOverviewCtrl',
        controllerAs: 'ctrl',
        resolve: {
          role: () => info,
        },
      },
    });
  }

  showDeleteConfirm(info) {
    this.CucCloudMessage.flushChildMessage();
    this.LogsRolesService.deleteModal(info).then(() => {
      this.delete = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsRolesService.deleteRole(this.serviceName, info)
            .then(() => this.initLoaders())
            .finally(() => this.CucControllerHelper.scrollPageToTop()),
      });
      this.delete.load();
    });
  }

  manageMembers(info) {
    this.$state.go('dbaas-logs.detail.members', {
      serviceName: this.serviceName,
      roleId: info.roleId,
    });
  }

  editPermissions(info) {
    this.$state.go('dbaas-logs.detail.permissions', {
      serviceName: this.serviceName,
      roleId: info.roleId,
    });
  }
}
