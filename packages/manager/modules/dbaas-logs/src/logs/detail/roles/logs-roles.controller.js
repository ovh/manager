import addTemplate from './add/logs-role-add.html';
import overviewTemplate from './overview/logs-role-overview.html';
import datagridToIcebergFilter from '../logs-iceberg.utils';

export default class LogsRolesCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    ouiDatagridService,
    CucCloudMessage,
    CucControllerHelper,
    LogsRolesService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.ouiDatagridService = ouiDatagridService;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsRolesService = LogsRolesService;
    this.CucCloudMessage = CucCloudMessage;
  }

  loadRoles({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'name';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsRolesService.getPaginatedRoles(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
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
      .finally(() => {
        this.ouiDatagridService.refresh('roles-datagrid', true);
      });
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
          this.LogsRolesService.deleteRole(this.serviceName, info).finally(
            () => {
              this.ouiDatagridService.refresh('roles-datagrid', true);
              this.CucControllerHelper.scrollPageToTop();
            },
          ),
      });
      this.delete.load();
    });
  }

  manageMembers(info) {
    this.$state.go('dbaas-logs.detail.roles.role.members', {
      serviceName: this.serviceName,
      roleId: info.roleId,
    });
  }

  editPermissions(info) {
    this.$state.go('dbaas-logs.detail.roles.role.permissions', {
      serviceName: this.serviceName,
      roleId: info.roleId,
    });
  }
}
