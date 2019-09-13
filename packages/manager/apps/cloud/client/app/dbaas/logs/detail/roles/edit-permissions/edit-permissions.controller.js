class LogsRolesPermissionsCtrl {
  constructor($q, $stateParams, CucCloudMessage, CucControllerHelper, LogsRolesService) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.roleId = this.$stateParams.roleId;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsRolesService = LogsRolesService;
    this.CucCloudMessage = CucCloudMessage;
    this.initLoaders();
  }

  initLoaders() {
    this.availableStreams = this.$q.defer();
    this.attachedStreams = this.$q.defer();
    this.availableIndices = this.$q.defer();
    this.attachedIndices = this.$q.defer();
    this.availableDashboards = this.$q.defer();
    this.attachedDashboards = this.$q.defer();
    this.availableAliases = this.$q.defer();
    this.attachedAliases = this.$q.defer();

    this.roleDetails = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.getRoleDetails(this.serviceName, this.roleId)
        .then((role) => {
          this.loadAttachedPermissions(role.permissions);
          this.loadAvailableAliases(role.permissions);
          this.loadAvailableDashboards(role.permissions);
          this.loadAvailableIndices(role.permissions);
          this.loadAvailableStreams(role.permissions);
          return role;
        }),
    });
    this.roleDetails.load();
  }

  loadAvailableAliases(permissionList) {
    this.allAliases = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.getAllAliases(this.serviceName)
        .then((result) => {
          const diff = _.map(_.filter(result, alias => alias.info.isShareable && !_.find(permissionList, permission => permission.aliasId === alias.info.aliasId)), 'info');
          this.availableAliases.resolve(diff);
        }),
    });
    this.allAliases.load();
  }

  loadAvailableIndices(permissionList) {
    this.allIndices = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.getAllIndices(this.serviceName)
        .then((result) => {
          const diff = _.map(_.filter(result, index => index.info.isShareable && !_.find(permissionList, permission => permission.indexId === index.info.indexId)), 'info');
          this.availableIndices.resolve(diff);
        }),
    });
    this.allIndices.load();
  }

  loadAvailableDashboards(permissionList) {
    this.allDashboards = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.getAllDashboards(this.serviceName)
        .then((result) => {
          const diff = _.map(_.filter(result, dashboard => dashboard.info.isShareable && !_.find(permissionList, permission => permission.dashboardId === dashboard.info.dashboardId)), 'info');
          this.availableDashboards.resolve(diff);
        }),
    });
    this.allDashboards.load();
  }

  loadAvailableStreams(permissionList) {
    this.allStreams = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.getAllStreams(this.serviceName)
        .then((result) => {
          const diff = _.map(_.filter(result, stream => stream.info.isShareable && !_.find(permissionList, permission => permission.streamId === stream.info.streamId)), 'info');
          this.availableStreams.resolve(diff);
        }),
    });
    this.allStreams.load();
  }

  /**
   * initializes and loads list of permissions
   * adding permissionId to the object of index, alias, dashboard and stream so as to use it to
   * remove permission later
   * @memberof LogsRolesPermissionsCtrl
   */
  loadAttachedPermissions(permissionList) {
    this.permissions = this.LogsRolesService.getNewPermissions();
    permissionList.forEach((permission) => {
      if (permission.index) {
        _.extend(permission.index, { permissionId: permission.permissionId });
        this.permissions.index.push(permission.index);
      }
      if (permission.alias) {
        _.extend(permission.alias, { permissionId: permission.permissionId });
        this.permissions.alias.push(permission.alias);
      }
      if (permission.stream) {
        _.extend(permission.stream, { permissionId: permission.permissionId });
        this.permissions.stream.push(permission.stream);
      }
      if (permission.dashboard) {
        _.extend(permission.dashboard, { permissionId: permission.permissionId });
        this.permissions.dashboard.push(permission.dashboard);
      }
    });
    this.attachedIndices.resolve(this.permissions.index);
    this.attachedAliases.resolve(this.permissions.alias);
    this.attachedDashboards.resolve(this.permissions.dashboard);
    this.attachedStreams.resolve(this.permissions.stream);
  }

  attachAlias(item) {
    this.CucCloudMessage.flushChildMessage();
    this.saveAlias = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.addAlias(this.serviceName, this.roleId, item[0]),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveAlias.load();
  }

  attachIndex(item) {
    this.CucCloudMessage.flushChildMessage();
    this.saveIndex = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.addIndex(this.serviceName, this.roleId, item[0]),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveIndex.load();
  }

  attachStream(item) {
    this.CucCloudMessage.flushChildMessage();
    this.saveStream = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService.addStream(this.serviceName, this.roleId, item[0]),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveStream.load();
  }

  attachDashboard(item) {
    this.CucCloudMessage.flushChildMessage();
    this.saveDashboard = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService
        .addDashboard(this.serviceName, this.roleId, item[0]),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveDashboard.load();
  }

  removePermission(permission) {
    this.CucCloudMessage.flushChildMessage();
    this.deletePermission = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsRolesService
        .removePermission(this.serviceName, this.roleId, permission),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.deletePermission.load();
  }
}

angular.module('managerApp').controller('LogsRolesPermissionsCtrl', LogsRolesPermissionsCtrl);
