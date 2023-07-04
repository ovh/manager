import filter from 'lodash/filter';
import find from 'lodash/find';

export default class LogsRoleOverviewCtrl {
  /* @ngInject */
  constructor($stateParams, $uibModalInstance, LogsRolesService, role) {
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$uibModalInstance = $uibModalInstance;
    this.LogsRolesService = LogsRolesService;
    this.allPermissions = [];
    this.members = [];
    this.role = role;

    this.attachedStreams = [];
    this.attachedAliases = [];
    this.attachedIndices = [];
    this.attachedDashboards = [];
    this.attachedOsds = [];
    this.filteredElements = [];

    this.initLoaders();
  }

  initLoaders() {
    this.LogsRolesService.getRolePermissions(
      this.serviceName,
      this.role.roleId,
    ).then(({ data }) => {
      this.allPermissions = data;
      this.loadAnySelectedAliases();
      this.loadAnySelectedIndices();
      this.loadAnySelectedDashboards();
      this.loadAnySelectedStreams();
      this.loadAnySelectedOsds();
    });
    this.LogsRolesService.getRoleMembers(
      this.serviceName,
      this.role.roleId,
    ).then((members) => {
      this.members = members.data;
    });
  }

  loadAnySelectedAliases() {
    this.LogsRolesService.getAllAliases(this.serviceName).then((result) => {
      this.attachedAliases = this.getSelected('aliasId', result);
    });
  }

  loadAnySelectedIndices() {
    this.LogsRolesService.getAllIndices(this.serviceName).then((result) => {
      this.attachedIndices = this.getSelected('indexId', result);
    });
  }

  loadAnySelectedDashboards() {
    this.LogsRolesService.getAllDashboards(this.serviceName).then((result) => {
      this.attachedDashboards = this.getSelected('dashboardId', result);
    });
  }

  loadAnySelectedStreams() {
    this.LogsRolesService.getAllStreams(this.serviceName).then((result) => {
      this.attachedStreams = this.getSelected('streamId', result);
    });
  }

  loadAnySelectedOsds() {
    this.LogsRolesService.getAllOsds(this.serviceName).then((result) => {
      this.attachedOsds = this.getSelected('osdId', result);
    });
  }

  getSelected(searchId, result) {
    this.filteredElements = filter(result, (obj) =>
      find(
        this.allPermissions,
        (permission) => permission[searchId] === obj[searchId],
      ),
    );
    return this.filteredElements;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
